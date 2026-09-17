const express = require('express');
const router = express.Router();
const { getStatistiques } = require('../controllers/stats.controller');

router.get('/', getStatistiques);

module.exports = router;