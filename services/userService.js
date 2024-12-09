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


const forgotPasswordService = async (userID, newPassword, currentPassword, email) => {

    if(userID){
        const user = await User.findOne({ where: {id: userID}});

        if(!user){
            throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if(!isMatch){
            throw new Error('Invalid current password');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, bcrypt.genSalt(10));
        await user.update({ password: hashedPassword });
        user.password = '';

        return user;
    }

    user = User.findOne({ where: {email} });

    if(!user){
        throw new Error('User not found');
    }

    sendEmailService(user, 'forgotPassword')

};

module.exports = {
    registerUserService,
    loginUserService,
    forgotPasswordService,

}