import { pb } from '../../src/pocketbase';

const API_BASE = 'https://db.zizazu.my.id';

const cityNames: Record<string, string> = {
    CGK: 'Jakarta (CGK)',
    JED: 'Jeddah (JED)',
    MED: 'Madinah (MED)',
    SUB: 'Surabaya (SUB)',
    DPS: 'Bali (DPS)',
};

function getCityName(code: string): string {
    return cityNames[code] || code;
}

function esc(v: unknown): string {
    return String(v ?? '')
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

// Excel serial (46151) -> "06 Sep 2026"
function formatDate(value: unknown): string {
    const serial = Number(value);
    if (!serial || isNaN(serial)) return esc(value);
    const d = new Date(Math.round((serial - 25569) * 86400 * 1000));
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatRupiah(n: unknown): string {
    return 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');
}

const STATUS_TEXT: Record<string, string> = {
    paid: 'Lunas',
    pending: 'Menunggu pembayaran',
    failed: 'Kedaluwarsa',
};

let allBookings: any[] = [];
let activeFilter = 'all';
let tickHandle: number | null = null;

export async function loadBookings() {
    const list = document.querySelector('#aktif .bk-list');
    if (!list) return;

    if (!pb.authStore.isValid) {
        list.innerHTML = `
            <div class="bk-empty">
                <h3>Belum masuk</h3>
                <p>Masuk dulu untuk melihat pesanan tiket Anda.</p>
                <button onclick="window.location.href='/login.html'">Masuk</button>
            </div>`;
        return;
    }

    try {
        let res;
        try {
            res = await pb.collection('bookings').getList(1, 50, {
                sort: '-created',
                expand: 'flight',
            });
        } catch {
            // Fallback: collection belum punya field autodate 'created'
            res = await pb.collection('bookings').getList(1, 50, {
                expand: 'flight',
            });
        }
        allBookings = res.items;
        renderBookings();
        startCountdowns();
    } catch (err: any) {
        console.error('Gagal memuat pesanan:', err.status, err.response);
        list.innerHTML = `
            <div class="bk-empty">
                <h3>Gagal memuat pesanan</h3>
                <p>${esc(err.response?.message || err.message || 'Kesalahan tidak diketahui')}</p>
            </div>`;
    }
}

function renderBookings() {
    const list = document.querySelector('#aktif .bk-list');
    if (!list) return;

    const rows = activeFilter === 'all'
        ? allBookings
        : allBookings.filter(b => b.status === activeFilter);

    if (rows.length === 0) {
        list.innerHTML = `
            <div class="bk-empty">
                <h3>Belum ada pesanan</h3>
                <p>Tiket yang Anda pesan akan muncul di sini.</p>
                <button onclick="document.querySelector('[data-target=pembelian]').click()">Cari tiket</button>
            </div>`;
        return;
    }

    list.innerHTML = rows.map(cardHTML).join('');
}

function cardHTML(b: any): string {
    const f = b.expand?.flight || {};
    const status: string = b.status || 'pending';
    const vendor = String(f.vendor || 'Garuda');
    const tripLabel = `${esc(f.prog)} &middot; ${esc(f.day)}`;

    const detailsBlock = `
        <div class="bk-details">
            <p class="bk-route">${parseRoute(f.rute1)}</p>
            <div class="bk-meta-list">
                <div class="bk-meta">
                    <img src="/icon/calender-icon.png" alt="">
                    <span class="bk-leg-field" data-pergi="${formatDate(f.dot)}" data-pulang="${formatDate(f.dot_turn)}">${formatDate(f.dot)}</span>
                </div>
                <div class="bk-meta">
                    <img src="/icon/time-icon.png" alt="">
                    <span class="bk-leg-field" data-pergi="${esc(f.time1)} WIB" data-pulang="${esc(f.time2)} WIB">${esc(f.time1)} WIB</span>
                </div>
                <div class="bk-meta">
                    <img src="/icon/plane-icon.png" alt="">
                    <span class="bk-leg-field" data-pergi="${esc(f.flight1)}" data-pulang="${esc(f.flight2)}">${esc(f.flight1)}</span>
                </div>
                <div class="bk-meta">
                    <img src="/icon/name-icon.png" alt="">
                    <span>${esc(b.passenger_name)}</span>
                </div>
            </div>

            <button class="bk-leg-toggle" type="button" data-leg="pergi">
                <img class="bk-leg-icon" src="/icon/plane-icon.png" alt="">
                <span>penerbangan pergi</span>
            </button>
        </div>

        <div class="bk-divider"></div>`;

    const airlineBlock = `
        <div class="bk-airline">
            <img src="/assets/Airlines/${encodeURIComponent(vendor)}.png" alt="${esc(vendor)}"
                 onerror="this.onerror=null; this.src='/Airlines/Garuda.png'">
        </div>`;

    if (status === 'paid') {
        return `
        <div class="bk-card" data-id="${esc(b.id)}">
            ${airlineBlock}
            ${detailsBlock}

            <div class="bk-booking">
                <div class="bk-booking-info">
                    <div class="bk-info-group">
                        <span class="bk-label">Kode pemesanan</span>
                        <span class="bk-value">${esc(b.order_id)}</span>
                    </div>
                    <div class="bk-info-group">
                        <span class="bk-label">Total bayar</span>
                        <span class="bk-price">${formatRupiah(b.amount)}</span>
                    </div>
                    <div class="bk-info-group">
                        <span class="bk-trip">${tripLabel}</span>
                        <span class="bk-payment">${esc(b.payment_type || '—')}</span>
                    </div>
                </div>
                <div class="bk-booking-actions">
                    <span class="bk-status bk-status--paid">${esc(STATUS_TEXT.paid)}</span>
                    <div class="bk-qr">E-tiket sedang diproses</div>
                    <button class="bk-eticket-btn" disabled>Lihat e-tiket</button>
                </div>
            </div>
        </div>`;
    }

    if (status === 'failed') {
        return `
        <div class="bk-card" data-id="${esc(b.id)}">
            ${airlineBlock}
            ${detailsBlock}

            <div class="bk-booking bk-booking-pending">
                <div class="bk-pending-row">
                    <div class="bk-info-group">
                        <span class="bk-label">Kode pemesanan</span>
                        <span class="bk-value">${esc(b.order_id)}</span>
                    </div>
                    <div class="bk-info-group bk-text-right">
                        <span class="bk-status bk-status--failed">${esc(STATUS_TEXT.failed)}</span>
                        <span class="bk-trip">${tripLabel}</span>
                    </div>
                </div>
                <div class="bk-pending-row bk-row-bottom">
                    <div class="bk-info-group">
                        <span class="bk-label">Sisa tagihan</span>
                        <span class="bk-price">${formatRupiah(b.amount)}</span>
                    </div>
                    <div class="bk-info-group bk-text-right">
                        <span class="bk-label">Batas waktu habis</span>
                    </div>
                </div>
                <button class="bk-pay bk-pay--expired" disabled>Kedaluwarsa</button>
            </div>
        </div>`;
    }

    // pending
    return `
    <div class="bk-card" data-id="${esc(b.id)}">
        ${airlineBlock}
        ${detailsBlock}

        <div class="bk-booking bk-booking-pending">
            <div class="bk-pending-row">
                <div class="bk-info-group">
                    <span class="bk-label">Kode pemesanan</span>
                    <span class="bk-value">${esc(b.order_id)}</span>
                </div>
                <div class="bk-info-group bk-text-right">
                    <span class="bk-status bk-status--pending">${esc(STATUS_TEXT.pending)}</span>
                    <span class="bk-trip">${tripLabel}</span>
                </div>
            </div>
            <div class="bk-pending-row bk-row-bottom" data-expiry="${esc(b.expiry_time || '')}">
                <div class="bk-info-group">
                    <span class="bk-label">Sisa tagihan</span>
                    <span class="bk-price">${formatRupiah(b.amount)}</span>
                </div>
                <div class="bk-info-group bk-text-right">
                    <span class="bk-label">Sisa waktu</span>
                    <span class="bk-countdown">--:--:--</span>
                </div>
            </div>
            <button class="bk-pay" data-order="${esc(b.order_id)}">Bayar sekarang</button>
        </div>
    </div>`;
}

/* ---------- Countdown ---------- */

function startCountdowns() {
    if (tickHandle) window.clearInterval(tickHandle);
    tick();
    tickHandle = window.setInterval(tick, 1000);
}

function tick() {
    document.querySelectorAll('#aktif .bk-row-bottom[data-expiry]').forEach(wrap => {
        const raw = (wrap as HTMLElement).dataset.expiry;
        const out = wrap.querySelector('.bk-countdown') as HTMLElement | null;
        if (!raw || !out) return;

        // Midtrans kirim "2026-08-20 09:36:43" (WIB) — jadikan ISO
        const expiry = new Date(raw.replace(' ', 'T') + '+07:00').getTime();
        const left = expiry - Date.now();

        if (isNaN(expiry)) { out.textContent = '--:--:--'; return; }

        if (left <= 0) {
            out.textContent = '00:00:00';
            out.classList.add('bk-countdown--urgent');
            const btn = wrap.closest('.bk-booking')?.querySelector('.bk-pay') as HTMLButtonElement | null;
            if (btn && !btn.disabled) {
                btn.disabled = true;
                btn.textContent = 'Kedaluwarsa';
                btn.classList.add('bk-pay--expired');
            }
            return;
        }

        const h = Math.floor(left / 3600000);
        const m = Math.floor((left % 3600000) / 60000);
        const s = Math.floor((left % 60000) / 1000);
        const p = (n: number) => String(n).padStart(2, '0');
        out.textContent = `${p(h)}:${p(m)}:${p(s)}`;
        out.classList.toggle('bk-countdown--urgent', left < 3600000);
    });
}

/* ---------- Aksi ---------- */

document.addEventListener('click', async (ev) => {
    const target = ev.target as HTMLElement;

    const filter = target.closest('.bk-filter') as HTMLElement | null;
    if (filter) {
        document.querySelectorAll('.bk-filter').forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
        activeFilter = filter.dataset.status || 'all';
        renderBookings();
        startCountdowns();
        return;
    }

    const btn = target.closest('.bk-pay') as HTMLButtonElement | null;
    if (!btn || btn.disabled) return;

    btn.disabled = true;
    btn.textContent = 'Memproses…';

    const reset = () => {
        btn.disabled = false;
        btn.textContent = 'Bayar sekarang';
    };

    try {
        const res = await fetch(`${API_BASE}/api/midtrans/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': pb.authStore.token,
            },
            body: JSON.stringify({ orderId: btn.dataset.order }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.token) {
            throw new Error(data.error || `Gagal memuat pembayaran (${res.status}).`);
        }

        // PENTING: setiap kali klik "Bayar sekarang", hook membuat order_id
        // baru (order lama tidak bisa dipakai ulang di Midtrans) dan
        // memperbarui baris booking. Kalau tombol masih menyimpan order_id
        // lama, klik berikutnya akan gagal "Pesanan tidak ditemukan".
        if (data.orderId) {
            btn.dataset.order = data.orderId;
        }

        if (!(window as any).snap) {
            throw new Error('Modul pembayaran belum termuat. Muat ulang halaman.');
        }

        (window as any).snap.pay(data.token, {
            onSuccess: () => loadBookings(),
            onPending: () => loadBookings(),
            onError: reset,
            onClose: reset,
        });
    } catch (err) {
        alert(err instanceof Error ? err.message : 'Terjadi kesalahan.');
        reset();
    }
});

// Toggle tampilan penerbangan pergi / pulang
document.addEventListener('click', (ev) => {
    const toggle = (ev.target as HTMLElement).closest('.bk-leg-toggle') as HTMLElement | null;
    if (!toggle) return;

    const card = toggle.closest('.bk-card');
    const label = toggle.querySelector('span');
    if (!card || !label) return;

    const isPergi = toggle.dataset.leg === 'pergi';
    const nextLeg = isPergi ? 'pulang' : 'pergi';

    toggle.dataset.leg = nextLeg;
    label.textContent = isPergi ? 'penerbangan pulang' : 'penerbangan pergi';

    card.querySelectorAll('.bk-leg-field').forEach(field => {
        const el = field as HTMLElement;
        el.textContent = el.dataset[nextLeg] || '';
    });
});

/* ---------- Init ---------- */
// Modul ini deferred, jadi DOM sudah siap saat baris ini jalan.
// Jangan bungkus dengan DOMContentLoaded — event itu sudah lewat.

const aktifTab = document.querySelector('[data-target="aktif"]');
aktifTab?.addEventListener('click', () => {
    if (allBookings.length === 0) loadBookings();
}, { once: true });

// Kalau tab "Tiket Aktif" sudah aktif saat halaman dimuat
if (document.querySelector('#aktif.active-content')) {
    loadBookings();
}