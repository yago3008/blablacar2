
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
    let distance = rawDistance;
    const [hoursPart, minutesPart] = rawDuration.split(" ");

    const hours = parseInt(hoursPart);
    const minutes = parseInt(minutesPart);
    const duration = hours + minutes;

    const distanceTax =  0.50;
    const durationTax = 0.10;

    totalPrice = (distance * distanceTax) + (duration * durationTax)
    const addTax = totalPrice + (totalPrice / 100) * 5;

    return addTax;
};

module.exports = {
    mapsService,
    calculatePriceService
}