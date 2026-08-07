import { pb } from '../../src/pocketbase';

// Airport code to full city name mapping
const cityNames: { [key: string]: string } = {
    'CGK': 'Jakarta (CGK)',
    'JED': 'Jeddah (Jeddah)',
    'MED': 'Medan (Medan)',
    'SUB': 'Surabaya (Surabaya)',
    'JEDJED': 'Jeddah (Jeddah)' // fallback for custom routes
};

function getCityName(code: string): string {
    return cityNames[code] || code;
}

// Converts raw Excel serial numbers (e.g., 46151) into readable dates (e.g., "06 Sep")
function formatExcelDate(serialNumber: number | string): string {
    const serial = Number(serialNumber);
    if (!serial || isNaN(serial)) return String(serialNumber);
    
    // Convert Excel epoch to JS epoch
    const date = new Date(Math.round((serial - 25569) * 86400 * 1000));
    
    // Format output to Indonesian locale (e.g., "06 Sep")
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
}

let allFlights: any[] = []; // Store all records globally for filtering

// 1. Check authentication
if (pb.authStore.isValid && pb.authStore.model) {
    const user = pb.authStore.model;
    const usernameEl = document.querySelector('#navUsername');
    const emailEl = document.querySelector('#navEmail');

    if (usernameEl) usernameEl.textContent = user.username || 'User';
    if (emailEl) emailEl.textContent = user.email || '';

    loadFlights();
} else {
    window.location.href = '../login.html';
}

// 2. Fetch all flights and setup search listener
async function loadFlights() {
    try {
        allFlights = await pb.collection('flights').getFullList();
        console.log("Fetched flights from PocketBase:", allFlights);
        
        renderFlights(allFlights);
        setupSearchFilter();
    } catch (error) {
        console.error('Error fetching flights from PocketBase:', error);
    }
}

// 3. Render flights to the DOM
function renderFlights(flightsToRender: any[]) {
    const ticketListContainer = document.querySelector('.ticket-list');
    if (!ticketListContainer) return;
    
    ticketListContainer.innerHTML = ''; 

    if (flightsToRender.length === 0) {
        ticketListContainer.innerHTML = `<div style="text-align: center; padding: 20px; color: #666;">Tidak ada penerbangan yang ditemukan.</div>`;
        return;
    }

    flightsToRender.forEach((flight: any) => {
        const basePrice = Number(flight.jual) || 0;
        const markupPrice = Number(flight.markup) || 0;
        const finalPrice = (basePrice + markupPrice) * 1000;
        
        const formattedPrice = finalPrice.toLocaleString('id-ID');

        // Parse rute1 (e.g. "CGKJED" -> "CGK (Jakarta) → JED (Jeddah)")
        const parseRoute = (routeStr: string) => {
            if (!routeStr) return '';
            if (routeStr.length === 6) {
                const originCode = routeStr.slice(0, 3);
                const destCode = routeStr.slice(3, 6);
                return `${getCityName(originCode)} &rarr; ${getCityName(destCode)}`;
            }
            return routeStr;
        };

        const ticketHTML = `
            <div class="ticket-wrapper">
                <div class="ticket-card">
                    <div class="airline-info">
                        <img src="assets/Airlines/${flight.vendor}.png" alt="${flight.vendor}" onerror="this.src='Airlines/Garuda.png'">
                    </div>

                    <div class="flight-details">
                        <div class="flight-leg">
                            <div class="route">Pergi: ${parseRoute(flight.rute1)}</div>
                            <div class="time-details">
                                <span><img src="assets/icon/calender-icon.png" alt=""> ${flight.dot}</span>
                                <span class="divider">|</span> 
                                <span>${flight.time1}</span> 
                                <span class="divider">|</span> 
                                <span><img src="assets/icon/time-icon.png" alt=""> ${flight.flight1}</span>
                            </div>
                        </div>

                        <div class="flight-leg">
                            <div class="route">Pulang: ${parseRoute(flight.rute2)}</div>
                            <div class="time-details">
                                <span><img src="assets/icon/plane-icon.png" alt=""> ${flight.dot_turn}</span> 
                                <span class="divider">|</span> 
                                <span>${flight.time2}</span> 
                                <span class="divider">|</span> 
                                <span><img src="assets/icon/time-icon.png" alt=""> ${flight.flight2}</span>
                            </div>
                        </div>
                    </div>

                    <div class="price-container">
                        <div class="duration">Durasi: ${flight.prog} (${flight.day})</div>
                        <div class="price">Rp ${formattedPrice}</div>
                    </div>

                    <div class="action-container">
                        <button class="btn-pilih" onclick="toggleBooking(this)">Pilih Tiket</button>
                    </div>
                </div>

                <!-- EXPANDABLE BOOKING FORM -->
                <div class="booking-form">
                    <h3 class="booking-title">Detail Penumpang</h3>
                    
                    <div class="form-row">
                        <div class="input-group" style="flex-grow: 1;">
                            <label>Nama Lengkap (Sesuai KTP/Paspor)</label>
                            <input type="text" class="booking-input" placeholder="Masukkan nama lengkap">
                        </div>
                        <div class="input-group" style="flex-grow: 1;">
                            <label>Nomor Identitas</label>
                            <input type="text" class="booking-input" placeholder="NIK / No. Paspor">
                        </div>
                    </div>

                    <div class="booking-footer">
                        <div class="total-price">
                            Total Tagihan: <span>Rp ${formattedPrice}</span>
                        </div>
                        <button class="btn-lanjut" onclick="goToPayment()">Lanjut ke Pembayaran</button>
                    </div>
                </div>
            </div>
        `;
        ticketListContainer.insertAdjacentHTML('beforeend', ticketHTML);
    });

}

// 4. Real-time Search Filtering
function setupSearchFilter() {
    // Looks for an input with class 'search-bar' or type 'search'
    const searchInput = document.querySelector('input[placeholder*="Search"], .search-bar, input[type="text"]') as HTMLInputElement;
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = (e.target as HTMLInputElement).value.toLowerCase().trim();

        const filtered = allFlights.filter(flight => {
            const r1 = (flight.rute1 || '').toLowerCase();
            const r2 = (flight.rute2 || '').toLowerCase();
            const vendor = (flight.vendor || '').toLowerCase();
            const f1 = (flight.flight1 || '').toLowerCase();
            const f2 = (flight.flight2 || '').toLowerCase();

            return r1.includes(query) || 
                   r2.includes(query) || 
                   vendor.includes(query) || 
                   f1.includes(query) || 
                   f2.includes(query) ||
                   // Allow searching full names like "jakarta" or "jeddah"
                   (query.includes('jakarta') && (r1.includes('cgk') || r2.includes('cgk'))) ||
                   (query.includes('jeddah') && (r1.includes('jed') || r2.includes('jed')));
        });

        renderFlights(filtered);
    });
}

// 5. Tab switching logic
const tabs = document.querySelectorAll('.tab-link');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        contents.forEach(content => content.classList.remove('active-content'));
        const targetId = tab.getAttribute('data-target');
        if (targetId) {
            const targetEl = document.getElementById(targetId);
            if (targetEl) targetEl.classList.add('active-content');
        }
    });
});

// 6. Global Window Actions
(window as any).toggleBooking = function(button: HTMLElement) {
    const wrapper = button.closest('.ticket-wrapper');
    if (!wrapper) return;
    wrapper.classList.toggle('active-booking');
    
    if (wrapper.classList.contains('active-booking')) {
        button.innerText = "Batalkan";
    } else {
        button.innerText = "Pilih Tiket";
    }
};



(window as any).goToPayment = function() {
    alert("Data penumpang berhasil disimpan! Mengarahkan ke halaman Pembayaran.");
};

(window as any).submitPayment = function() {
    alert("Konfirmasi pembayaran berhasil dikirim!");
};