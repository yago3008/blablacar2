const User = require('../models/User');

const getUsersService = async () => {
    users = await User.findAll({
        attributes: ['id', 'fullname', 'email', 'role', 'birth'], 
    });
    if (!users) throw new Error('No users found');

    return users;
};

module.exports = {
    getUsersService,
};