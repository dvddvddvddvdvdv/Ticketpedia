import { pb } from '../../src/pocketbase';

const API_BASE = 'https://db.zizazu.my.id';

// Airport code to full city name mapping
const cityNames: { [key: string]: string } = {
    'CGK': 'Jakarta (CGK)',
    'JED': 'Jeddah (Jeddah)',
    'MED': 'Medan (Medan)',
    'SUB': 'Surabaya (Surabaya)',
    'JEDJED': 'Jeddah (Jeddah)'
};

function getCityName(code: string): string {
    return cityNames[code] || code;
}

function formatExcelDate(serialNumber: number | string): string {
    const serial = Number(serialNumber);
    if (!serial || isNaN(serial)) return String(serialNumber);
    const date = new Date(Math.round((serial - 25569) * 86400 * 1000));
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
}

function esc(value: unknown): string {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function parseRoute(routeStr: string): string {
    if (!routeStr) return '';
    if (routeStr.length === 6) {
        return `${esc(getCityName(routeStr.slice(0, 3)))} &rarr; ${esc(getCityName(routeStr.slice(3, 6)))}`;
    }
    return esc(routeStr);
}

function formatRupiah(n: number): string {
    return 'Rp ' + n.toLocaleString('id-ID');
}

let allFlights: any[] = [];

/* ---------- Inventaris kursi (dibagi lintas akun) ---------- */

// Jumlah pesanan aktif (bukan 'failed') per penerbangan, dihitung dari SEMUA
// akun — bukan cuma milik user saat ini — supaya dua akun berbeda tidak bisa
// sama-sama memesan kursi yang sama tanpa terdeteksi.
let bookedCounts: Map<string, number> = new Map();

async function loadBookedCounts(): Promise<void> {
    try {
        const bookings = await pb.collection('bookings').getFullList({
            filter: 'status != "failed"',
            fields: 'flight',
        });
        const counts = new Map<string, number>();
        bookings.forEach((b: any) => {
            const flightId = b.flight;
            if (!flightId) return;
            counts.set(flightId, (counts.get(flightId) || 0) + 1);
        });
        bookedCounts = counts;
    } catch (error) {
        console.error('Gagal memuat jumlah pesanan per penerbangan:', error);
    }
}

// 'hk' adalah field jumlah kursi tersedia dari data flights (bervariasi per
// baris, mis. 45/90), beda dengan 'total' yang tampaknya kapasitas pesawat
// tetap (selalu 200). Kalau field ini keliru, cukup ganti nama field di sini.
function seatCapacity(flight: any): number {
    return Number(flight.hk) || 0;
}

function seatsRemaining(flight: any): number {
    const capacity = seatCapacity(flight);
    if (capacity <= 0) return Infinity; // tidak ada data kapasitas — jangan batasi
    return capacity - (bookedCounts.get(flight.id) || 0);
}

/* ---------- Keranjang pesanan (belum dibayar) ---------- */

interface CartItem {
    flightId: string;
    routeLabel: string;
    passengerName: string;
    price: number; // per orang, dalam rupiah
}

const cart = new Map<string, CartItem>(); // key: flightId

function cartTotal(): number {
    let sum = 0;
    cart.forEach(item => (sum += item.price));
    return sum;
}

function renderCartBar() {
    const bar = document.querySelector('#cart-bar');
    if (!bar) return;

    if (cart.size === 0) {
        bar.innerHTML = '';
        (bar as HTMLElement).style.display = 'none';
        return;
    }

    (bar as HTMLElement).style.display = 'flex';
    bar.innerHTML = `
        <div class="cart-info">
            <strong>${cart.size}</strong> tiket dipilih &middot;
            <span class="cart-total">${formatRupiah(cartTotal())}</span>
        </div>
        <div class="cart-actions">
            <button class="btn-cart-clear" type="button">Kosongkan</button>
            <button class="btn-cart-checkout" type="button">Pesan Tiket</button>
        </div>
    `;
}

/* ---------- Auth & role (unchanged) ---------- */

const isGuest = !pb.authStore.isValid;
const user = pb.authStore.record;
const isAdmin = pb.authStore.isSuperuser;

const userRole = user ? (user.vendor || 'user') : null;
const isStandardUser = userRole === 'user' && !isAdmin;
const isPendingVendor = userRole === 'pending' && !isAdmin;
const isApprovedVendor = userRole === 'approved' && !isAdmin;

const usernameEl = document.querySelector('#navUsername');
const emailEl = document.querySelector('#navEmail');

if (!isGuest && user) {
    if (usernameEl) usernameEl.textContent = user.username || 'User';
    if (emailEl) emailEl.textContent = user.email || '';
} else if (isAdmin) {
    if (usernameEl) usernameEl.textContent = 'Admin';
    if (emailEl) emailEl.textContent = pb.authStore.record?.email || '';
} else {
    if (usernameEl) usernameEl.textContent = 'Guest';
}

function applyRoleVisibility() {
    const loginBtn = document.querySelector('#loginBtn') as HTMLElement;
    const applyVendorBtn = document.querySelector('#applyVendorBtn') as HTMLElement;
    const pendingVendorStatus = document.querySelector('#pendingVendorStatus') as HTMLElement;
    const vendorDashboardBtn = document.querySelector('#vendorDashboardBtn') as HTMLElement;
    const adminPanelBtn = document.querySelector('#adminPanelBtn') as HTMLElement;

    if (applyVendorBtn) applyVendorBtn.style.display = 'none';
    if (pendingVendorStatus) pendingVendorStatus.style.display = 'none';
    if (vendorDashboardBtn) vendorDashboardBtn.style.display = 'none';
    if (adminPanelBtn) adminPanelBtn.style.display = 'none';
    if (loginBtn) loginBtn.style.display = isGuest ? 'block' : 'none';

    if (isStandardUser) {
        if (applyVendorBtn) applyVendorBtn.style.display = 'block';
    } else if (isPendingVendor) {
        if (pendingVendorStatus) pendingVendorStatus.style.display = 'block';
    } else if (isApprovedVendor) {
        if (vendorDashboardBtn) vendorDashboardBtn.style.display = 'block';
    } else if (isAdmin) {
        if (adminPanelBtn) adminPanelBtn.style.display = 'block';
    }
}
// Modul dieksekusi setelah DOM parsed (deferred), jadi jalankan langsung
applyRoleVisibility();

loadFlights();

async function loadFlights() {
    try {
        allFlights = await pb.collection('flights').getFullList();
        await loadBookedCounts();
        renderFlights(allFlights);
        setupSearchFilter();
    } catch (error) {
        console.error('Error fetching flights from PocketBase:', error);
    }
}

function renderFlights(flightsToRender: any[]) {
    const container = document.querySelector('.ticket-list');
    if (!container) return;

    if (flightsToRender.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:20px; color:#666;">
                Tidak ada penerbangan yang ditemukan.
            </div>`;
        return;
    }

    container.innerHTML = flightsToRender.map((flight: any) => {
        const basePrice = Number(flight.jual) || 0;
        const markupPrice = Number(flight.markup) || 0;
        const finalPrice = (basePrice + markupPrice) * 1000;
        const formattedPrice = finalPrice.toLocaleString('id-ID');

        const vendor = String(flight.vendor || 'Garuda');
        const logoSrc = `/Airlines/${encodeURIComponent(vendor)}.png`;
        const routeLabel = `${flight.rute1 ? parseRoute(flight.rute1).replace(/&rarr;|&amp;/g, ' - ') : ''}`;
        const inCart = cart.has(flight.id);

        const remaining = seatsRemaining(flight);
        const soldOut = remaining <= 0;
        const lowStock = !soldOut && remaining !== Infinity && remaining <= 5;

        let pilihLabel = inCart ? 'Batalkan' : 'Pilih Tiket';
        if (soldOut && !inCart) pilihLabel = 'Tiket Habis';

        return `
        <div class="ticket-wrapper" data-flight-id="${esc(flight.id)}" data-price="${finalPrice}">
            <div class="ticket-card">
                <div class="airline-info">
                    <img src="${logoSrc}" alt="${esc(vendor)}"
                         onerror="this.onerror=null; this.src='/Airlines/Garuda.png'">
                </div>

                <div class="flight-details">
                    <div class="flight-leg">
                        <div class="route">Pergi: ${parseRoute(flight.rute1)}</div>
                        <div class="time-details">
                            <span><img src="/icon/calender-icon.png" alt=""> ${esc(formatExcelDate(flight.dot))}</span>
                            <span class="divider">|</span>
                            <span>${esc(flight.time1)}</span>
                            <span class="divider">|</span>
                            <span class="time-date"><img src="/icon/time-icon.png" alt=""> ${esc(flight.flight1)}</span>
                        </div>
                    </div>

                    <div class="flight-leg">
                        <div class="route">Pulang: ${parseRoute(flight.rute2)}</div>
                        <div class="time-details">
                            <span><img src="/icon/plane-icon.png" alt=""> ${esc(formatExcelDate(flight.dot_turn))}</span>
                            <span class="divider">|</span>
                            <span>${esc(flight.time2)}</span>
                            <span class="divider">|</span>
                            <span class="time-date"><img src="/icon/time-icon.png" alt=""> ${esc(flight.flight2)}</span>
                        </div>
                    </div>
                </div>

                <div class="price-container">
                    <div class="duration">Durasi: ${esc(flight.prog)} (${esc(flight.day)})</div>
                    ${lowStock ? `<div class="duration" style="color:#D97706;font-weight:600;">Sisa ${remaining} kursi</div>` : ''}
                    <div class="price">Rp ${formattedPrice}</div>
                </div>

                <div class="action-container">
                    <button class="btn-pilih" type="button" ${soldOut && !inCart ? 'disabled' : ''}>${esc(pilihLabel)}</button>
                </div>
            </div>

            <!-- FORM PENUMPANG — mengisi data sebelum ditambahkan ke pesanan -->
            <div class="booking-form">
                <h3 class="booking-title">Detail Penumpang</h3>

                <div class="form-row">
                    <div class="input-group" style="flex-grow:1;">
                        <label>Nama Lengkap (Sesuai KTP/Paspor)</label>
                        <input type="text" class="booking-input" data-field="name"
                               placeholder="Masukkan nama lengkap" value="${esc(cart.get(flight.id)?.passengerName || '')}">
                    </div>
                </div>

                <div class="booking-footer">
                    <div class="total-price">
                        Harga per orang: <span>Rp ${formattedPrice}</span>
                    </div>
                    <button class="btn-lanjut" type="button">${inCart ? 'Perbarui di Pesanan' : 'Tambah ke Pesanan'}</button>
                </div>
            </div>
        </div>`;
    }).join('');

    // Buka kembali kartu yang sudah ada di keranjang, biar terlihat jelas
    cart.forEach((_item, flightId) => {
        const wrapper = container.querySelector(`[data-flight-id="${flightId}"]`);
        wrapper?.classList.add('active-booking');
    });
}

function setupSearchFilter() {
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
                   (query.includes('jakarta') && (r1.includes('cgk') || r2.includes('cgk'))) ||
                   (query.includes('jeddah') && (r1.includes('jed') || r2.includes('jed')));
        });

        renderFlights(filtered);
    });
}

/* ---------- Tab switching (unchanged) ---------- */

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

/* ---------- Aksi kartu tiket (delegated) ---------- */

document.addEventListener('click', async (ev) => {
    const target = ev.target as HTMLElement;

    // Toggle buka/tutup form penumpang
    const pilihBtn = target.closest('.btn-pilih') as HTMLButtonElement | null;
    if (pilihBtn) {
        if (isGuest) {
            alert('Silakan login atau daftar terlebih dahulu untuk memesan tiket.');
            return;
        }
        const wrapper = pilihBtn.closest('.ticket-wrapper') as HTMLElement;
        const flightId = wrapper?.dataset.flightId;

        if (flightId && cart.has(flightId)) {
            // Sudah ada di keranjang — klik ini membatalkannya
            cart.delete(flightId);
            renderFlights(allFlights);
            renderCartBar();
            return;
        }

        wrapper?.classList.toggle('active-booking');
        pilihBtn.innerText = wrapper?.classList.contains('active-booking') ? 'Batalkan' : 'Pilih Tiket';
        return;
    }

    // Tambah / perbarui item di keranjang
    const lanjutBtn = target.closest('.btn-lanjut') as HTMLButtonElement | null;
    if (lanjutBtn) {
        const wrapper = lanjutBtn.closest('.ticket-wrapper') as HTMLElement;
        if (!wrapper) return;

        const flightId = wrapper.dataset.flightId!;
        const price = Number(wrapper.dataset.price) || 0;
        const nameInput = wrapper.querySelector('[data-field="name"]') as HTMLInputElement;

        const passengerName = nameInput?.value.trim() || '';

        if (!passengerName) {
            alert('Silakan masukkan Nama Lengkap penumpang terlebih dahulu!');
            nameInput?.focus();
            return;
        }

        const routeEl = wrapper.querySelector('.route');
        cart.set(flightId, {
            flightId,
            routeLabel: routeEl?.textContent || '',
            passengerName,
            price,
        });

        renderFlights(allFlights);
        renderCartBar();
        return;
    }

    // Kosongkan keranjang
    if (target.closest('.btn-cart-clear')) {
        if (cart.size === 0) return;
        if (!confirm('Kosongkan semua tiket yang dipilih?')) return;
        cart.clear();
        renderFlights(allFlights);
        renderCartBar();
        return;
    }

    // Buat pesanan (pending) untuk semua item di keranjang
    const checkoutBtn = target.closest('.btn-cart-checkout') as HTMLButtonElement | null;
    if (checkoutBtn) {
        if (!pb.authStore.isValid) {
            alert('Sesi Anda telah berakhir. Silakan login kembali.');
            window.location.href = '/login.html';
            return;
        }
        if (cart.size === 0) return;

        checkoutBtn.disabled = true;
        checkoutBtn.textContent = 'Memproses…';

        // Cek ulang stok tepat sebelum membuat pesanan — akun lain bisa saja
        // mengambil kursi terakhir sejak halaman ini pertama dimuat.
        await loadBookedCounts();
        const outOfStock: string[] = [];
        cart.forEach((item, flightId) => {
            const flight = allFlights.find(f => f.id === flightId);
            if (flight && seatsRemaining(flight) <= 0) {
                outOfStock.push(item.routeLabel || flightId);
                cart.delete(flightId);
            }
        });

        if (outOfStock.length > 0) {
            alert(`Maaf, tiket berikut sudah habis dan dihapus dari pesanan:\n${outOfStock.join('\n')}`);
            renderFlights(allFlights);
            renderCartBar();
            if (cart.size === 0) {
                checkoutBtn.disabled = false;
                checkoutBtn.textContent = 'Pesan Tiket';
                return;
            }
        }

        const items = Array.from(cart.values());
        const failures: string[] = [];
        let successCount = 0;

        for (const item of items) {
            try {
                const res = await fetch(`${API_BASE}/api/midtrans/token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': pb.authStore.token,
                    },
                    // Endpoint ini membuat booking berstatus "pending" dan
                    // mengembalikan Snap token — kita hanya memakai efek
                    // sampingnya (record pending) dan sengaja TIDAK
                    // memanggil snap.pay() di sini. Pembayaran dilakukan
                    // belakangan lewat tombol "Bayar sekarang" di Tiket Aktif.
                    body: JSON.stringify({
                        flightId: item.flightId,
                        name: item.passengerName,
                    }),
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data.error || `Gagal (${res.status})`);
                successCount++;
            } catch (err) {
                console.error('Gagal membuat pesanan:', item.flightId, err);
                failures.push(item.routeLabel || item.flightId);
            }
        }

        cart.clear();
        renderCartBar();

        if (failures.length > 0) {
            alert(
                `${successCount} pesanan berhasil dibuat.\n` +
                `${failures.length} gagal:\n${failures.join('\n')}`
            );
        }

        // Arahkan ke Tiket Aktif supaya pesanan pending langsung terlihat
        const aktifTab = document.querySelector('[data-target="aktif"]') as HTMLElement;
        aktifTab?.click();
    }
});

/* ---------- Sisa fungsi lama ---------- */

(window as any).submitPayment = function () {
    alert('Konfirmasi pembayaran berhasil dikirim!');
};

(window as any).requestVendorStatus = async function () {
    if (!user || isGuest) return;
    try {
        const confirmRequest = confirm('Apakah Anda yakin ingin mendaftar sebagai Vendor?');
        if (!confirmRequest) return;
        await pb.collection('users').update(user.id, { vendor: 'pending' });
        alert('Permintaan berhasil dikirim! Menunggu persetujuan Admin.');
        window.location.reload();
    } catch (error) {
        console.error('Gagal mengirim permintaan:', error);
        alert('Terjadi kesalahan saat mendaftar vendor.');
    }
};