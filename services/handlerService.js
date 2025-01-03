const User = require('../models/User');
const jwt = require('jsonwebtoken');

const expirationTokenIsValid = async (id) => {
    try {
        const user = await User.findByPk(id);

        if (!user) return true;
        
        try {
            const token = jwt.verify(user.verificationToken, process.env.JWT_SECRET);

            if ((token.exp < Date.now() / 1000) && !user.emailConfirmed) return false;

            else return true;

        } catch (err) {
            if (err.message === 'jwt expired' && !user.emailConfirmed) return false;

            else return true;
        }
    } catch (error) {
        console.error("Error to search user:", error.message);
        return true;
    }
};

const removeExpiredUsers = async () => {
    console.log("Removing expired users");
    try {
        const users = await User.findAll();
        const expiredUsers = [];

        for (const user of users) {
            const isValid = await expirationTokenIsValid(user.id);
            if (!isValid) expiredUsers.push(user.id);
        }

        if (expiredUsers.length > 0) {
            await User.destroy({ where: { id: expiredUsers } });
            console.log(`${expiredUsers.length} users removed`);
        }
    } catch (error) {
        console.error("Error to remove users:", error.message);
    }
};

/**
 * Lida com a validação e processamento do arquivo recebido.
 * @param {Object} file - Arquivo enviado pelo cliente.
 * @returns {string} Caminho onde o arquivo foi salvo.
 * @throws {Error} Se nenhum arquivo foi enviado.
 */
const processUploadedFile = (file) => {
    if (!file) {
        throw new Error('Nenhum arquivo enviado.');
    }
    return file.path; // Retorna o caminho do arquivo salvo
};



module.exports = {
    removeExpiredUsers,
    processUploadedFile,
};
