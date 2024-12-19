const { getUserService, updateUserService, rateUserService, registerCarService, offerTravelService, getTravelService } = require('../services/apiService');

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

const offerTravelController = async (req, res) => {
    const { id } = req.user;
    const origin = encodeURIComponent(req.body.origin);
    const destination = encodeURIComponent(req.body.destination);
    const { carID, price, time, seats} = req.body;

    try {
        const travel = await offerTravelService(id, origin, destination, carID, price, time, seats);
        return res.status(200).json({ message: 'Travel registered successfully', travel: travel });
    } catch (err) {
        return res.status(401).json({ error: err.message });
    };

};

const getTravelController = async (req, res) => {
    const { orderBy, origin, destination } = req.query

    try {
        const travels = await getTravelService(orderBy, origin, destination);
        return res.status(200).json(travels);
    } catch (err) {
        return res.status(401).json({ error: err.message });
    };
 
};

module.exports = {
    getUserController,
    updateUserController,
    rateUserController,
    registerCarController,
    offerTravelController,
    getTravelController
};