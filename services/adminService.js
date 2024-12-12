const User = require('../models/User');

const getUsersService = async () => {
    const users = await User.findAll({
        attributes: ['id', 'fullname', 'email', 'role', 'birth', 'driverLicense'], 
    });
    if (!users) throw new Error('No users found');

    return users;
};

module.exports = {
    getUsersService,
};