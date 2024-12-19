const User = require('../models/User');
const Rate = require('../models/Rate');
const Car = require('../models/Car');
const Trip = require('../models/Trip');
const { Op } = require('sequelize');
const { getDurationAndDistanceService, calculatePriceService } = require('./mapsService');

const getUserService = async (id) => {
    const user = await User.findByPk(id, {
        attributes: ['id', 'fullname', 'email', 'role', 'birth', 'driverLicense'], 
    });

    if (!user) throw new Error('No users found');

    return user;
};

const updateUserService = async (id, fullname, birth) => {
    const user = await User.findByPk(id);

    if (!user) throw new Error('User not found');

    const updatedUser = await user.update({ fullname, birth });

    return updatedUser;
};

const rateUserService = async (evaluatorID, stars, evaluateeID, comment) => {
    const evaluator = await User.findByPk(evaluatorID);
    const evaluatee = await User.findByPk(evaluateeID);

    if(stars < 1 || stars > 5 || !stars || !Number.isInteger(stars)) throw new Error('Invalid Rate quantity');
    if(!evaluator) throw new Error('evaluator not found');
    if(!evaluatee) throw new Error('evaluatee not found');

    if((stars === 1 || stars === 5) && !comment) throw new Error('Comment is required to this rate note');
    if((stars === 1 || stars === 5) && comment.length < 5) throw new Error('Comment must be at least 5 characters');

    evaluatee.rateQty += 1;
    evaluatee.rateNote = parseFloat((evaluatee.rateNote * (evaluatee.rateQty - 1)) + stars) / evaluatee.rateQty;

    await evaluatee.save();
    await Rate.create({ stars, evaluateeID, evaluatorID, comment });

    return parseFloat(evaluatee.rateNote.toFixed(2));

};

const registerCarService = async (id, model, brand, year, color, licensePlate) => {
    const user = await User.findByPk(id);
    const car = await Car.findOne({ where: { licensePlate } });

    if (!user) throw new Error('User not found');
    if (car) throw new Error('Car already registered');
    if (!model || !brand || !year || !color || !licensePlate) throw new Error("Information required missing");
    if (year < 1990 || year > new Date().getFullYear()) throw new Error("Invalid year");
    
    const registeredCar = await Car.create({ model, brand, year, color, licensePlate, userID: id });
    
    return registeredCar;
};

const offerTravelService = async (userID, origin, destination, carID, price, time, seats) => {
    const user = await User.findByPk(userID);
    const car = await Car.findByPk(carID);
    const { duration, distance } = await getDurationAndDistanceService(origin, destination);
    const suggestedPrice = await calculatePriceService(distance, duration)
    
    if (!user) throw new Error('User not found');
    if (!car) throw new Error('Car not found');
    if (!duration || !distance) throw new Error('Duration or distance error');
    if (!origin || !destination || !carID || !price || !time || !seats) throw new Error('Information required missing');
    if (seats < 0 || seats > 4) throw new Error('Invalid seats quantity');

    if (price > (suggestedPrice * 1.3))  throw new Error(`max price is ${suggestedPrice * 1.3}`); //+30%
    if (price < (suggestedPrice * 0.7))  throw new Error(`max price is ${suggestedPrice * 0.7}`); //-30%

    const decodedOrigin = decodeURIComponent(origin);
    const decodedDestination = decodeURIComponent(destination);
    
    const trip = await Trip.create({
        origin: decodedOrigin, 
        destination: decodedDestination,
        distance,
        duration, 
        price, 
        time, 
        seats,
        carID,
        userID
    });

    return trip;
};

const getTravelService = async (orderBy, origin, destination) => {
    const validOrderFields = ['origin', 'destination', 'price', 'seats'];

    if (!origin && !destination) throw new Error('Origin and Destination must be specified');
    if (!validOrderFields.includes(orderBy)) {
        throw new Error(`Invalid order field: ${orderBy}. Valid fields are: ${validOrderFields.join(', ')}`);
    }

    const travels = await Trip.findAll({
        where: {
            [Op.or]: [
                { origin: { [Op.like]: `%${origin}%` } },
                { destination: { [Op.like]: `%${destination}%` } }
            ]
        },
        order: [
            [orderBy, 'ASC']
        ]
    });
    
    if (!travels.length) throw new Error('No travels found');

    return travels;
};


module.exports = {
    getUserService,
    updateUserService,
    rateUserService,
    registerCarService,
    offerTravelService,
    getTravelService
};