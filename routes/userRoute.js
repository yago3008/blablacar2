const express = require('express');
const router = express.Router();
const { registerUserController, loginController, changePasswordController } = require('../controllers/userController');
const { confirmEmailController } = require('../controllers/emailController');
const { authenticateToken } = require('../middleware/auth');

router
    .post('/register', registerUserController)
    .post('/login', loginController)
    // .post('/change-password', authenticateToken, changePasswordController)
    .get('/confirm-email', confirmEmailController);

module.exports = router;