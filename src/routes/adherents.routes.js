const express = require('express');
const router = express.Router();
const {
  getAllAdherents,
  getAdherentById,
  createAdherent,
  updateAdherent,
  deleteAdherent,
  getHistoriqueEmprunts,
} = require('../controllers/adherents.controller');

router.get('/', getAllAdherents);
router.get('/:id', getAdherentById);
router.get('/:id/emprunts', getHistoriqueEmprunts);
router.post('/', createAdherent);
router.put('/:id', updateAdherent);
router.delete('/:id', deleteAdherent);

module.exports = router;