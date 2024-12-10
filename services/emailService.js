const nodemailer = require('nodemailer');
const User = require('../models/User');
const { generateTokenService } = require('../middleware/auth');



const sendEmailService = async (user, key) => {

    const token = generateTokenService(user.id, user.role)
    
    const emailSubjects = {
        confirmEmail: 'Email Confirmation',
        forgotPassword: 'Reset Your Password',
    };

    const emailBodys = {
        confirmEmail: `<p>Confirm email, <a href='http://localhost:3000/user/confirm-email?token=${token}'>Click here</a> to confirm.</p>`,
        forgotPassword: `<p>Reset you password, <a href='http://localhost:3000/user/forgot-password?token=${token}'>Click here</a> to reset.</p>`,
    };

    const body = emailBodys[key] || 'Body email default to debug purposes, userID: ' + user.id
    const subject = emailSubjects[key] || 'Subject email default to debug purposes, userID: ' + user.id

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS,
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: subject,
        html: body,
        text: 'This link will expire in 10 minutes.'
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
};

const confirmTokenService = async (id) => {
    const user = await User.findByPk(id)
    
    if (!user) {
        throw new Error('User not found');
    }

    user.update({ emailConfirmed: true });
    return user.email
};

module.exports = {
    sendEmailService,
    confirmTokenService
};
