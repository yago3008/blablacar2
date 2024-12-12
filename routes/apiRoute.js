const express = require('express');
const router = express.Router();
const { getUserController, updateUserController, rateUserController } = require('../controllers/apiController');
const { authenticateToken } = require('../middleware/auth');

router
    .get('/get-user', authenticateToken, getUserController)
    .put('/update-user', authenticateToken, updateUserController)
    .post('/rate-user', authenticateToken, rateUserController);
    
module.exports = router;