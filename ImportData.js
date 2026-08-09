import fs from 'fs';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://db.zizazu.id');

const rawData = fs.readFileSync('flights_data.json', 'utf-8');
const flights = JSON.parse(rawData);

// Helper function to convert Excel serial number to "06 Sep" format
function convertExcelDate(serial) {
    const num = Number(serial);
    if (!num || isNaN(num)) return serial;
    
    // Convert Excel serial to JS Date object
    const date = new Date(Math.round((num - 25569) * 86400 * 1000));
    
    // Hardcode the month abbreviations to guarantee the exact format
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Extract day and pad with leading zero (e.g., '6' becomes '06')
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    
    return `${day} ${month}`;
}

async function importFlights() {
    await pb.collection('_superusers').authWithPassword('admin@ticketpedia.com', 'password123');
    
    const validFlights = flights.filter(f => f.ROUTE);
    console.log(`Starting import of ${validFlights.length} tickets...`);

    for (const rawFlight of validFlights) {
        const startingRouteCode = rawFlight['RUTE 1'];     

        const pbData = {
            day: convertExcelDate(rawFlight['DAY']),
            prog: rawFlight['PROG'],
            rout: rawFlight['ROUTE'] || 'JEDJED', 
            short_route: startingRouteCode, 
            rute1: rawFlight['RUTE 1'],
            rute2: rawFlight['RUTE 1_1'], 
            
            // Applied the date converter to DOT and DOT TURN
            dot: convertExcelDate(rawFlight['DOT']),
            flight1: rawFlight['FLIGHT 1'],
            time1: rawFlight['TIME 1'],
            dot_turn: convertExcelDate(rawFlight['DOT TURN']),
            
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