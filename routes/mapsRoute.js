const express = require('express');
const router = express.Router();
const { mapsController, calculatePriceController } = require('../controllers/mapsController');
const { authenticateToken } = require('../middleware/auth');


router
    .get('/', mapsController)
    .get('/price', calculatePriceController);

module.exports = router;