const express = require('express');
const router = express.Router();
const {
  getAllLivres,
  getLivreById,
  createLivre,
  updateLivre,
  deleteLivre,
} = require('../controllers/livres.controller');

router.get('/', getAllLivres);
router.get('/:id', getLivreById);
router.post('/', createLivre);
router.put('/:id', updateLivre);
router.delete('/:id', deleteLivre);

module.exports = router;