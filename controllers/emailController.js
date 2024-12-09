const { confirmEmailService } = require('../services/emailService');
const jwt = require('jsonwebtoken');

const confirmEmailController = async (req, res) => {
    const { token } = req.query;

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id
        
        const confirmedEmail = await confirmEmailService(userId);
        return res.status(200).json({message: 'email confirmed successfully', email: confirmedEmail});
    }
    catch(err){
        return res.status(500).json({error: err.message});
    }
};


module.exports = {
    confirmEmailController,
};
