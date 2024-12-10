const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { sendEmailService } = require('./emailService')
const { generateTokenService } = require('../middleware/auth');

const registerUserService = async (fullname, password, email) => {
    const userExist = await User.findOne({ where: { email } })

    if (userExist && userExist.emailConfirmed) {
        throw new Error('Email already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ fullname, password: hashedPassword, email: email });
    const token = generateTokenService(user.id, user.role);
    await user.update({ verificationToken: token });

    sendEmailService(user, 'confirmEmail');
};

const loginUserService = async (email, password) =>{
    const user = await User.findOne({ where: { email } });

    if (!user){
        throw new Error('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch){
        throw new Error('Invalid credentials');
    }

    const token = generateTokenService(user.id, user.role);
    user.password = ""
    return { user, token };
};


const forgotPasswordService = async (email, method, token, password) => {

    if (method === 'POST'){
        const user = await User.findOne({ where: { email } });
        if(!user){
            throw new Error('User not found');
        }
        sendEmailService(user, 'forgotPassword');
    };

    if (method === 'GET'){
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decodedToken.id);

        if(!user){
            throw new Error('User not found');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await user.update({ password: hashedPassword });
        user.password = '';
        return user;
    };
 
};

const changePasswordService = async (userID, currentPassword, newPassword) => {
    const user = await User.findByPk(userID);

    if(!user){
        throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if(!isMatch){
        throw new Error('Invalid current password');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await user.update({ password: hashedPassword });
    user.password = '';
    return user;

};

module.exports = {
    registerUserService,
    loginUserService,
    forgotPasswordService,
    changePasswordService
}