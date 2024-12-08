const User = require('../models/User');
const jwt = require('jsonwebtoken');
const cron = require('node-cron');

const verifyExpirationToken = async (id) => {
    const user = await User.findByPk(id);

    if (user && user.verificationToken) {
        try {
            const token = jwt.verify(user.verificationToken, process.env.SECRET_KEY);
            return token.exp >= Date.now() / 1000;
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return false;
            }
            return false;
        }
    }
    return false;
};


const removeExpiredUsers = async () => {
    console.log("Iniciando limpeza de usuários expirados...");
    try {
        // Busca todos os usuários
        const users = await User.findAll();
        const expiredUsers = [];

        for (const user of users) {
            const isValid = await verifyExpirationToken(user.id);
            if (!isValid) {
                expiredUsers.push(user.id);
            }
        }

        if (expiredUsers.length > 0) {
            await User.destroy({ where: { id: expiredUsers } });
            console.log(`${expiredUsers.length} usuários removidos.`);
        } else {
            console.log("Nenhum usuário expirado encontrado.");
        }
    } catch (error) {
        console.error("Erro ao executar a limpeza de usuários:", error.message);
    }
};


module.exports = {
    removeExpiredUsers,
}