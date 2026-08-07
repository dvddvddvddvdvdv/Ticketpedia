import fs from 'fs';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://db.zizazu.id');

const rawData = fs.readFileSync('flights_data.json', 'utf-8');
const flights = JSON.parse(rawData);

// Helper function to convert Excel serial number to a readable date (e.g., "06 Sep")
function convertExcelDate(serial) {
    const num = Number(serial);
    if (!num || isNaN(num)) return serial;
    const date = new Date(Math.round((num - 25569) * 86400 * 1000));
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

async function importFlights() {
    await pb.collection('_superusers').authWithPassword('admin@ticketpedia.com', 'password123');
    
    const validFlights = flights.filter(f => f.ROUTE);
    console.log(`Starting import of ${validFlights.length} tickets...`);

    for (const rawFlight of validFlights) {
        const startingRouteCode = rawFlight['RUTE 1'];     

        const pbData = {
            // Convert the raw number to a clean text date
            day: convertExcelDate(rawFlight['DAY']),
            
            prog: rawFlight['PROG'],
            rout: rawFlight['ROUTE'] || 'JEDJED', 
            short_route: startingRouteCode, 
            rute1: rawFlight['RUTE 1'],
            rute2: rawFlight['RUTE 1_1'], 
            dot: rawFlight['DOT'],
            flight1: rawFlight['FLIGHT 1'],
            time1: rawFlight['TIME 1'],
            dot_turn: rawFlight['DOT TURN'],
            flight2: rawFlight['FLIGHT 2'],
            time2: rawFlight['TIME 2'],
            hk2: rawFlight['HK2'] || '',
            hk: rawFlight['HK'],
            jual: rawFlight['JUAL'],
            beli: rawFlight['BELI'],
            vendor: rawFlight['VENDOR'],
            total: (rawFlight['JUAL'] || 0) - (rawFlight['BELI'] || 0), 
            markup: 0, 
            status: rawFlight['SOLD'] === 'SOLD' ? 'sold' : 'available' 
        };

        try {
            await pb.collection('flights').create(pbData);
            console.log(`Success: Added route ${pbData.short_route}`);
        } catch (error) {
            console.error(`Failed to add flight:`, error.message);
        }
    }
    
    console.log('Import complete!');
}

importFlights();