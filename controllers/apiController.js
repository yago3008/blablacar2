const { getUserService, updateUserService, rateUserService, registerCarService } = require('../services/apiService');

const getUserController = async (req, res) => {
    const { id } = req.user;
    try{
        const user = await getUserService(id);
        return res.status(200).json({ user });
    } catch (err) {
        return res.status(401).json({ error: err.message });
    };
};

const updateUserController = async (req, res) => {
    const { id } = req.user;
    const { fullname, birth }  = req.body;
    try{
        const updatedUser = await updateUserService(id, fullname, birth);
        return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch(err){
        return res.status(401).json({ error: err.message });
    };
};

const rateUserController = async (req, res) => {
    const { id } = req.user;
    const { stars, evaluatee, comment } = req.body;

    try{
        const rateAvg = await rateUserService(id, stars, evaluatee, comment);
        return res.status(200).json({ message: 'User rated successfully', average: rateAvg });
    } catch(err){
        return res.status(401).json({ error: err.message });
    };
};

const registerCarController = async (req, res) => {
    const { id } = req.user;
    const { model, brand, year, color, licensePlate } = req.body;
    
    try {
        const car = await registerCarService(id, model, brand, year, color, licensePlate);
        return res.status(200).json({ message: 'Car registered successfully', car: car });
    } catch (err) {
        return res.status(401).json({ error: err.message });
    };
};

module.exports = {
    getUserController,
    updateUserController,
    rateUserController,
    registerCarController
};