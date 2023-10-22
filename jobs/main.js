const { parentPort } = require('node:worker_threads');
const { lat, lon, radius } = require('../config.json');

async function lookForFlights() {
    const data = await fetch(`https://api.adsb.one/v2/point/${lat}/${lon}/${radius}`);
    const body = await data.json();

    for (const flight of body?.ac) {
        try {
            const photo = await fetchPhoto(flight.r);
            if (parentPort)
                parentPort.postMessage({
                    event: 'flightFound',
                    data: { ...flight, photo }
                });
        } catch (err) {
            console.log(`An error occured while sending a notification for ${flight?.flight?.trim()}: ${err.message}`);
        }
    }
}

async function fetchPhoto(registration) {
    const data = await fetch(`https://api.planespotters.net/pub/photos/reg/${registration}`);
    if (!data.ok) return null;

    const body = await data.json();

    return body?.photos?.[0]?.thumbnail_large?.src ?? null;
}

void lookForFlights().catch(console.log);
