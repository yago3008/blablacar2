const User = require('../models/User');
const Rate = require('../models/Rate');

const getUsersService = async () => {
    const users = await User.findAll({
        attributes: ['id', 'fullname', 'email', 'role', 'birth', 'driverLicense'], 
    });
    if (!users) throw new Error('No users found');

    return users;
};

const getRatesService = async () => {
    const rates = await Rate.findAll();

    if (!rates) throw new Error('No rates found');

    return rates;
};

module.exports = {
    getUsersService,
    getRatesService
};