const { sequelize } = require('./database');
const { User } = require('../models/app');
const { hashPassword } = require('../middleware/auth');
const ATT_DATABASE = false;
const { generateTokenService } = require('../middleware/auth');
const bcrypt = require('bcrypt');

const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: ATT_DATABASE })
        console.log('Database synchronized');
        createAdmin();
    } catch (err) {
        console.error('Error syncing database:', err);
    }
};

const createAdmin = async () => {
    const adminExists = await User.findByPk(1)
    if (!adminExists) {
        try {
            const user = await User.create({
                fullname: 'admin',
                password: await hashPassword('admin'),
                role: 'admin',
                emailConfirmed: true,
                email: 'admin@blablacar2.com',
                verificationToken: generateTokenService(1, 'admin')
            });
        } catch (err) {
            console.error('Error creating admin user:', err);
        }
    }
};

module.exports = syncDatabase;