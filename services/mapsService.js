
const mapsService = async (origin, destination) => {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${process.env.GOOGLE_MAPS_SERVICE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const leg = route.legs[0];
        const duration = leg.duration.text;
        const distance = leg.distance.text;

        return { duration, distance };
    } else {
        throw new Error('Nenhuma rota encontrada');
    }
};

const calculatePriceService = async (rawDistance, rawDuration) => {
    let distance = parseFloat(rawDistance);

    const hoursParts = rawDuration.split(" ");
    let hours = 0;
    let minutes = 0;

    if (hoursParts[1] === "hours") {
        hours = parseInt(hoursParts[0]);
        if (hoursParts[2] === "mins") {
            minutes = parseInt(hoursParts[2]);
        }
    } else if (hoursParts[1] === "mins") {
        minutes = parseInt(hoursParts[0]);
    } else {
        throw new Error("Bad format for duration");
    }

    const duration = (hours * 60 + minutes) / 60;

    const distanceTax = 0.20;
    const durationTax = 2.50;

    const totalPrice = (distance * distanceTax) + (duration * durationTax);

    const addTax = totalPrice + (totalPrice / 100) * 5;

    return parseFloat(addTax.toFixed(2));
};

module.exports = {
    mapsService,
    calculatePriceService
}