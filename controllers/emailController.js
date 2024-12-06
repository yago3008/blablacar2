const { confirmEmailService } = require('../services/emailService');

const confirmEmailController = async (req, res) => {
    const { id } = req.query;
    console.log(id);

    try{
        const confirmedEmail = await confirmEmailService(id);
        return res.status(200).json({message: 'email confirmed successfully', email: confirmedEmail});
    }
    catch(err){
        return res.status(500).json({error: err.message});
    }
};


module.exports = {
    confirmEmailController,
};
