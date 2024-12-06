const { registerUserService, confirmEmailService, loginUserService } = require('../services/userService');
const User = require('../models/User');
const registerUserController = async (req, res) => {
    const { username, password, email } = req.body;

    try {
        const newUser = await registerUserService(username, password, email);
        return res.status(200).json({message: 'user registered successfully, please confirm your email', user: newUser});
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
};

const loginController = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } })

    if (!user.emailConfirmed) {
        return res.status(401).json({ error: 'User not confirmed yet' });
    }
    
    try{
        const user = await loginUserService(username, password);
        return res.status(200).json({ message: 'login successfully', user: user });
    } catch(err){
        return res.status(401).json({ error: err.message }); 
    }
};



module.exports = {
    registerUserController,
    loginController,
};