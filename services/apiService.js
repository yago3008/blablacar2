const User = require('../models/User');
const Rate = require('../models/Rate');

const getUserService = async (id) => {
    const user = await User.findByPk(id, {
        attributes: ['id', 'fullname', 'email', 'role', 'birth', 'driverLicense'], 
    });

    if (!user) throw new Error('No users found');

    return user;
};

const updateUserService = async (id, fullname, birth) => {
    const user = await User.findByPk(id);

    if (!user) {
        throw new Error('User not found');
    }

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
    if(comment.length < 5) throw new Error('Comment must be at least 5 characters');

    evaluatee.rateQty += 1;
    evaluatee.rateNote = parseFloat((evaluatee.rateNote * (evaluatee.rateQty - 1)) + stars) / evaluatee.rateQty;

    await evaluatee.save();
    await Rate.create({ stars, evaluateeID, evaluatorID, comment });

    return parseFloat(evaluatee.rateNote.toFixed(2));

};

module.exports = {
    getUserService,
    updateUserService,
    rateUserService
};