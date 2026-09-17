const express = require('express');
const router = express.Router();
const {
  createEmprunt,
  retournerEmprunt,
  getEmpruntsEnCours,
  getEmpruntsEnRetard,
} = require('../controllers/emprunts.controller');

router.get('/en-cours', getEmpruntsEnCours);
router.get('/en-retard', getEmpruntsEnRetard);
router.post('/', createEmprunt);
router.put('/:id/retour', retournerEmprunt);

module.exports = router;