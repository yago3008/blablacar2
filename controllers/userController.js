const { registerUserService, loginUserService, forgotPasswordService, changePasswordService, registerCarService } = require('../services/userService');
const User = require('../models/User');
const { processUploadedFile } = require('../services/handlerService');

const registerUserController = async (req, res) => {
    const { fullname, password, email, birth, imgProfile } = req.body;

    try {
        const newUser = await registerUserService(fullname, password, email, birth, imgProfile);
        return res.status(200).json({message: 'user registered successfully, please confirm your email', user: newUser});
    } catch (err) {
        return res.status(401).json({error: err.message});
    }
};

const loginController = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } })

    if (!user.emailConfirmed) {
        return res.status(401).json({ error: 'User not confirmed yet' });
    }

    try{
        const user = await loginUserService(email, password);
        return res.status(200).json({ message: 'login successfully', user: user });
    } catch(err){
        return res.status(401).json({ error: err.message }); 
    }
};

const forgotPasswordController = async (req, res) => {
    const method = req.method

    if (method === 'POST') {
        const { email } = req.body;
        try {
            await forgotPasswordService(email, method, false, false);
            return res.status(200).json({ message: `Email sent to ${email}` });
        } catch (err) {
            return res.status(401).json({ error: err.message });
        };
    };

    if (method === 'GET') {
        const { token } = req.query;
        const { password } = req.body;

        try {
            const user = await forgotPasswordService(false, method, token, password);
            return res.status(200).json({ message: 'password reset link has been validated', user: user });
        } catch (err) {
            return res.status(401).json({ error: err.message });
        };
    };
};

const changePasswordController = async (req, res) => {
    const { id } = req.user;
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await changePasswordService(id, currentPassword, newPassword);
        return res.status(200).json({ message: 'password changed successfully', user: user });
    } catch (err){
        return res.status(401).json({ error: err.message });
    };
};

/**
 * Controla o fluxo de upload de arquivos.
 * @param {Object} req - Objeto da requisição.
 * @param {Object} res - Objeto da resposta.
 */
const uploadFileController = (req, res) => {
    try {
        const filePath = processUploadedFile(req.file);
        console.log(filePath);
        res.status(200).json({ message: 'Foto enviada com sucesso!', filePath });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = {
    registerUserController,
    loginController,
    forgotPasswordController,
    changePasswordController,
    uploadFileController,
};