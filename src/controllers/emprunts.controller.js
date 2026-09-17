const pool = require('../config/db');

// Enregistrer un nouvel emprunt
async function createEmprunt(req, res, next) {
  try {
    const { adherent_id, livre_id, date_retour_prevue } = req.body;

    if (!adherent_id || !livre_id || !date_retour_prevue) {
      return res.status(400).json({
        error: 'adherent_id, livre_id et date_retour_prevue sont obligatoires',
      });
    }

    // On verifie d'abord que le livre existe et qu'il est bien disponible
    const livre = await pool.query('SELECT * FROM livres WHERE id = $1', [livre_id]);
    if (livre.rows.length === 0) {
      return res.status(404).json({ error: 'Livre non trouve' });
    }
    if (livre.rows[0].statut === 'emprunte') {
      // Regle metier obligatoire du cahier des charges : pas d'emprunt si deja emprunte
      return res.status(400).json({ error: 'Ce livre est deja emprunte' });
    }

    // On verifie aussi que l'adherent existe
    const adherent = await pool.query('SELECT * FROM adherents WHERE id = $1', [adherent_id]);
    if (adherent.rows.length === 0) {
      return res.status(404).json({ error: 'Adherent non trouve' });
    }

    // Creation de l'emprunt
    const result = await pool.query(
      `INSERT INTO emprunts (adherent_id, livre_id, date_retour_prevue)
       VALUES ($1, $2, $3) RETURNING *`,
      [adherent_id, livre_id, date_retour_prevue]
    );

    // Le livre passe automatiquement au statut "emprunte"
    await pool.query('UPDATE livres SET statut = $1 WHERE id = $2', ['emprunte', livre_id]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// Enregistrer le retour d'un livre
async function retournerEmprunt(req, res, next) {
  try {
    const { id } = req.params;

    const emprunt = await pool.query('SELECT * FROM emprunts WHERE id = $1', [id]);
    if (emprunt.rows.length === 0) {
      return res.status(404).json({ error: 'Emprunt non trouve' });
    }
    if (emprunt.rows[0].date_retour_effective) {
      return res.status(400).json({ error: 'Ce livre a deja ete rendu' });
    }

    // On marque l'emprunt comme rendu (date du jour)
    const result = await pool.query(
      `UPDATE emprunts SET date_retour_effective = CURRENT_DATE
       WHERE id = $1 RETURNING *`,
      [id]
    );

    // Le livre redevient disponible
    await pool.query('UPDATE livres SET statut = $1 WHERE id = $2', [
      'disponible',
      emprunt.rows[0].livre_id,
    ]);

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// Liste des emprunts en cours (pas encore rendus)
async function getEmpruntsEnCours(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT e.*, a.nom AS adherent_nom, l.titre AS livre_titre
       FROM emprunts e
       JOIN adherents a ON a.id = e.adherent_id
       JOIN livres l ON l.id = e.livre_id
       WHERE e.date_retour_effective IS NULL
       ORDER BY e.date_emprunt DESC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// Liste des emprunts en retard (date prevue depassee et livre non rendu)
async function getEmpruntsEnRetard(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT e.*, a.nom AS adherent_nom, l.titre AS livre_titre
       FROM emprunts e
       JOIN adherents a ON a.id = e.adherent_id
       JOIN livres l ON l.id = e.livre_id
       WHERE e.date_retour_effective IS NULL
         AND e.date_retour_prevue < CURRENT_DATE
       ORDER BY e.date_retour_prevue ASC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createEmprunt,
  retournerEmprunt,
  getEmpruntsEnCours,
  getEmpruntsEnRetard,
};