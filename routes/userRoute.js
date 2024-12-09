const express = require('express');
const router = express.Router();
const { registerUserController, loginController, changePasswordController, forgotPasswordController } = require('../controllers/userController');
const { confirmEmailController } = require('../controllers/emailController');
const { authenticateToken } = require('../middleware/auth');

router
    .post('/register', registerUserController)
    .post('/login', loginController)
    .get('/confirm-email', confirmEmailController)
    .get('/change-password', changePasswordController)
    .post('/forgot-password', forgotPasswordController);
module.exports = router;