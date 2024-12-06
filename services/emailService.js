const nodemailer = require('nodemailer');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

const sendEmailService = async (email, id) => {
    const token = generateToken(id)

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'eulastones@gmail.com',
            pass: 'sueq wmbt eyrm mzkv'
        }
    });

    const mailOptions = {
        from: 'eulastones@gmail.com',
        to: email,
        subject: 'Email Confirmation',
        html: `<p>Confirm email, <a href='http://localhost:3000/user/confirm-email?id=${token}'>Click here</a> to confirm.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error: ', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

const confirmEmailService = async (id) => {
    const user = await User.findByPk(id)
    
    if (!user) {
        throw new Error('User not found');
    }

    user.update({ emailConfirmed: true });
    return user.email
};

module.exports = {
    sendEmailService,
    confirmEmailService
};
