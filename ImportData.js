import fs from 'fs';
import PocketBase from 'pocketbase';

// 1. Initialize PocketBase
const pb = new PocketBase('https://db.zizazu.id');

// 2. Read the JSON file
const rawData = fs.readFileSync('flights_data.json', 'utf-8');
const flights = JSON.parse(rawData);

async function importFlights() {
    // Authenticate as the Admin
    await pb.collection('_superusers').authWithPassword('admin@ticketpedia.com', 'password123');
    
    // Filter out those empty rows at the bottom of your JSON
    const validFlights = flights.filter(f => f.ROUTE);
    console.log(`Starting import of ${validFlights.length} tickets...`);

    for (const rawFlight of validFlights) {
        // Map the uppercase/spaced Excel keys to lowercase PocketBase keys
        const pbData = {
            day: rawFlight['DAY'],
            prog: rawFlight['PROG'],
            route: rawFlight['ROUTE'],
            dot: rawFlight['DOT'],
            flight1: rawFlight['FLIGHT 1'],
            rute1: rawFlight['RUTE 1'],
            time1: rawFlight['TIME 1'],
            dot_turn: rawFlight['DOT TURN'],
            flight2: rawFlight['FLIGHT 2'],
            rute2: rawFlight['RUTE 1_1'], // Maps RUTE 1_1 to rute2
            time2: rawFlight['TIME 2'],
            hk: rawFlight['HK'],
            jual: rawFlight['JUAL'],
            beli: rawFlight['BELI'],
            vendor: rawFlight['VENDOR'],
            // If it says "SOLD" in Excel, mark it sold, otherwise make it available
            status: rawFlight['SOLD'] === 'SOLD' ? 'sold' : 'available' 
        };

        try {
            await pb.collection('flights').create(pbData);
            console.log(`Success: Added route ${pbData.rute1} -> ${pbData.rute2}`);
        } catch (error) {
            console.error(`Failed to add flight:`, error.message);
        }
    }
    
    console.log('Import complete! Check your PocketBase dashboard.');
}

importFlights();