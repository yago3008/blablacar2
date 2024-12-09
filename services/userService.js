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


const hashPassword = async (newPassword) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    return hashedPassword

};



module.exports = {
    registerUserService,
    loginUserService,
    hashPassword,
}