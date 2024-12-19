const express = require('express');
const router = express.Router();
const { getUserController, updateUserController, rateUserController, registerCarController, offerTravelController, getTravelController } = require('../controllers/apiController');
const { authenticateToken } = require('../middleware/auth');

router
    .get('/get-user', authenticateToken, getUserController)
    .put('/update-user', authenticateToken, updateUserController)
    .post('/rate-user', authenticateToken, rateUserController)
    .post('/register-car', authenticateToken, registerCarController)
    .post('/offer-travel', authenticateToken, offerTravelController)
    .get('/get-travel', authenticateToken, getTravelController);
module.exports = router;