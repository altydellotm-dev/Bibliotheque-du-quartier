const pool = require('../config/db');

async function getAllAdherents(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM adherents ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function getAdherentById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM adherents WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Adherent non trouve' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function createAdherent(req, res, next) {
  try {
    const { nom, contact } = req.body;
    if (!nom || !contact) {
      return res.status(400).json({ error: 'Le nom et le contact sont obligatoires' });
    }
    const result = await pool.query(
      'INSERT INTO adherents (nom, contact) VALUES ($1, $2) RETURNING *',
      [nom, contact]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateAdherent(req, res, next) {
  try {
    const { id } = req.params;
    const { nom, contact } = req.body;
    if (!nom || !contact) {
      return res.status(400).json({ error: 'Le nom et le contact sont obligatoires' });
    }
    const result = await pool.query(
      'UPDATE adherents SET nom = $1, contact = $2 WHERE id = $3 RETURNING *',
      [nom, contact, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Adherent non trouve' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteAdherent(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM adherents WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Adherent non trouve' });
    }
    res.json({ message: 'Adherent supprime avec succes' });
  } catch (err) {
    next(err);
  }
}

async function getHistoriqueEmprunts(req, res, next) {
  try {
    const { id } = req.params;
    const adherent = await pool.query('SELECT * FROM adherents WHERE id = $1', [id]);
    if (adherent.rows.length === 0) {
      return res.status(404).json({ error: 'Adherent non trouve' });
    }
    const result = await pool.query(
      `SELECT e.id, e.date_emprunt, e.date_retour_prevue, e.date_retour_effective,
              l.titre AS livre_titre
       FROM emprunts e
       JOIN livres l ON l.id = e.livre_id
       WHERE e.adherent_id = $1
       ORDER BY e.date_emprunt DESC`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllAdherents,
  getAdherentById,
  createAdherent,
  updateAdherent,
  deleteAdherent,
  getHistoriqueEmprunts,
};