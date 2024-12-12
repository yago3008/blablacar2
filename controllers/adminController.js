const { getUsersService, getRatesService } = require('../services/adminService');

const getUsersController = async (req, res) => {
    try {
        const users = await getUsersService();
        return res.status(200).json(users);
    } catch (err) {
        return res.status(401).json({ error: err.message });
    };
};

const getRatesController = async (req, res) => {
    try {
        const rates = await getRatesService();
        return res.status(200).json(rates);
    } catch (err) {
        return res.status(401).json({ error: err.message });
    };
};

module.exports = {
    getUsersController,
    getRatesController,
};