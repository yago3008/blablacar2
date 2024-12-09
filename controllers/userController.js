const { registerUserService, loginUserService, forgotPasswordService } = require('../services/userService');
const User = require('../models/User');

const registerUserController = async (req, res) => {
    const { fullname, password, email } = req.body;

    try {
        const newUser = await registerUserService(fullname, password, email);
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
    console.log(req.user)
    if(req.user.id){
        const { newPassword, currentPassword } = req.body;
        try{
            user = await forgotPasswordService(req.user.id, newPassword, currentPassword, email = false);
            return res.status(200).json({ message: 'password reseted:', user });
        } catch(err){
            return res.status(401).json({ error: err.message });
        };
    }
    try{
        const { email } = req.body;
        user = await forgotPasswordService(req.user.id = false, newPassword = false, currentPassword = false, email);
        return res.status(200).json({ message: 'password reset link sent to your email' });
    }   catch(err){
        return res.status(401).json({ error: err.message });
    };
    
};

const changePasswordController = async (req, res) => {

};

module.exports = {
    registerUserController,
    loginController,
    forgotPasswordController,
    changePasswordController,
};