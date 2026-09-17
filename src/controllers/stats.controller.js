const pool = require('../config/db');

// Tableau de bord : compteurs + livre le plus emprunte + adherent le plus actif
async function getStatistiques(req, res, next) {
  try {
    // Compteurs simples (executes en parallele pour aller plus vite)
    const [totalLivres, totalAdherents, empruntsEnCours, empruntsEnRetard] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM livres'),
      pool.query('SELECT COUNT(*) FROM adherents'),
      pool.query('SELECT COUNT(*) FROM emprunts WHERE date_retour_effective IS NULL'),
      pool.query(
        `SELECT COUNT(*) FROM emprunts
         WHERE date_retour_effective IS NULL AND date_retour_prevue < CURRENT_DATE`
      ),
    ]);

    // Le livre le plus emprunte (toutes periodes confondues)
    const livrePlusEmprunte = await pool.query(
      `SELECT l.id, l.titre, COUNT(e.id) AS nombre_emprunts
       FROM emprunts e
       JOIN livres l ON l.id = e.livre_id
       GROUP BY l.id, l.titre
       ORDER BY nombre_emprunts DESC
       LIMIT 1`
    );

    // L'adherent le plus actif (celui qui a fait le plus d'emprunts)
    const adherentPlusActif = await pool.query(
      `SELECT a.id, a.nom, COUNT(e.id) AS nombre_emprunts
       FROM emprunts e
       JOIN adherents a ON a.id = e.adherent_id
       GROUP BY a.id, a.nom
       ORDER BY nombre_emprunts DESC
       LIMIT 1`
    );

    res.json({
      total_livres: parseInt(totalLivres.rows[0].count),
      total_adherents: parseInt(totalAdherents.rows[0].count),
      emprunts_en_cours: parseInt(empruntsEnCours.rows[0].count),
      emprunts_en_retard: parseInt(empruntsEnRetard.rows[0].count),
      livre_plus_emprunte: livrePlusEmprunte.rows[0] || null,
      adherent_plus_actif: adherentPlusActif.rows[0] || null,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getStatistiques,
};