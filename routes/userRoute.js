const express = require('express');
const router = express.Router();
const { registerUserController, loginController, changePasswordController, forgotPasswordController, uploadFileController } = require('../controllers/userController');
const { confirmTokenController } = require('../controllers/emailController');
const { authenticateToken } = require('../middleware/auth');
const { uploadMiddleware } = require('../middleware/handlerMiddleware');

router
    .post('/register', registerUserController)
    .post('/login', loginController)
    .get('/confirm-email', confirmTokenController)
    .post('/change-password', authenticateToken, changePasswordController)
    .post('/forgot-password', forgotPasswordController)
    .get('/forgot-password', forgotPasswordController)
    .post('/upload', uploadMiddleware.single('photo'), uploadFileController)

module.exports = router;