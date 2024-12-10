const { mapsService, calculatePriceService } = require('../services/mapsService');

const mapsController = async (req, res) => {
    try {
        const origin = encodeURIComponent(req.query.origin);
        const destination = encodeURIComponent(req.query.destination);

        data = await mapsService(origin, destination)
        return res.status(200).json(data);
    } catch (err) {
        return res.status(401).json({ error: err.message });
    }
};

const calculatePriceController = async (req, res) => {
    const { distance, duration } = req.body;

    try{
        const price = await calculatePriceService(distance, duration);
        return res.status(200).json({ price });
    } catch (err) {
        return res.status(401).json({ error: err.message });
    };
};

module.exports = {
    mapsController,
    calculatePriceController,
};
