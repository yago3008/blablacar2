const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { sendEmailService } = require('./emailService')


const registerUserService = async (username, password, email) => {
    const userExists = await User.findOne({ where: { username } })
    const emailExists = await User.findOne({ where: { email } })

    if (userExists) {
        throw new Error('Username already exists');
    }
    if (emailExists) {
        throw new Error('Email already exists');
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({ username, password: hashedPassword, email: email });
    const user = await User.findOne({ where: { username } })
    sendEmailService(email, user.id);
};

const loginUserService = async (username, password) =>{
    const user = await User.findOne({ where: { username } });
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

const confirmEmailService = async (id) => {
    const user = await User.findOne({ where: { id } });
    if (!user) {
        throw new Error('Invalid id');
    }
    user.emailConfirmed = true;
    await user.save();
};

const hashPassword = async (newPassword) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    return hashedPassword

};

const generateTokenService = (userId, userRole)  => {
    return jwt.sign({ id: userId, role: userRole }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

module.exports = {
    registerUserService,
    loginUserService,
    hashPassword,
    confirmEmailService,
}