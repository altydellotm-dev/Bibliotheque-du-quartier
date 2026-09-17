const express = require('express');
const router = express.Router();
const {
  getAllAuteurs,
  getAuteurById,
  createAuteur,
  updateAuteur,
  deleteAuteur,
} = require('../controllers/auteurs.controller');

router.get('/', getAllAuteurs);
router.get('/:id', getAuteurById);
router.post('/', createAuteur);
router.put('/:id', updateAuteur);
router.delete('/:id', deleteAuteur);

module.exports = router;