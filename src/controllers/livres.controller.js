const pool = require('../config/db');

async function getAllLivres(req, res, next) {
  try {
    const { search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let baseQuery = `
      SELECT l.id, l.titre, l.annee_publication, l.statut,
             a.id AS auteur_id, a.nom AS auteur_nom
      FROM livres l
      LEFT JOIN auteurs a ON a.id = l.auteur_id
    `;
    let countQuery = 'SELECT COUNT(*) FROM livres l LEFT JOIN auteurs a ON a.id = l.auteur_id';
    const params = [];

    if (search) {
      baseQuery += ' WHERE l.titre ILIKE $1 OR a.nom ILIKE $1';
      countQuery += ' WHERE l.titre ILIKE $1 OR a.nom ILIKE $1';
      params.push(`%${search}%`);
    }

    baseQuery += ` ORDER BY l.id LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

    const [livresResult, countResult] = await Promise.all([
      pool.query(baseQuery, [...params, limit, offset]),
      pool.query(countQuery, params),
    ]);

    const total = parseInt(countResult.rows[0].count);

    res.json({
      data: livresResult.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getLivreById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT l.*, a.nom AS auteur_nom
       FROM livres l
       LEFT JOIN auteurs a ON a.id = l.auteur_id
       WHERE l.id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Livre non trouve' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function createLivre(req, res, next) {
  try {
    const { titre, auteur_id, annee_publication } = req.body;
    if (!titre) {
      return res.status(400).json({ error: 'Le titre est obligatoire' });
    }
    const result = await pool.query(
      `INSERT INTO livres (titre, auteur_id, annee_publication)
       VALUES ($1, $2, $3) RETURNING *`,
      [titre, auteur_id || null, annee_publication || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateLivre(req, res, next) {
  try {
    const { id } = req.params;
    const { titre, auteur_id, annee_publication } = req.body;
    if (!titre) {
      return res.status(400).json({ error: 'Le titre est obligatoire' });
    }
    const result = await pool.query(
      `UPDATE livres SET titre = $1, auteur_id = $2, annee_publication = $3
       WHERE id = $4 RETURNING *`,
      [titre, auteur_id || null, annee_publication || null, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Livre non trouve' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteLivre(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM livres WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Livre non trouve' });
    }
    res.json({ message: 'Livre supprime avec succes' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllLivres,
  getLivreById,
  createLivre,
  updateLivre,
  deleteLivre,
};