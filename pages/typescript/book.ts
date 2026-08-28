import { pb } from '../../src/pocketbase';

const API_BASE = 'https://db.zizazu.my.id';

/* ---------- State & Constants ---------- */

let allBookings: any[] = [];
let activeFilter = 'all';
let tickHandle: number | undefined;

const cityNames: Record<string, string> = {
    CGK: 'Jakarta (CGK)',
    JED: 'Jeddah (JED)',
    MED: 'Madinah (MED)',
    SUB: 'Surabaya (SUB)',
    DPS: 'Bali (DPS)',
};

const STATUS_TEXT: Record<string, string> = {
    paid: 'Lunas',
    pending: 'Menunggu pembayaran',
    failed: 'Kedaluwarsa',
};

/* ---------- Utility Helpers ---------- */

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

function getExcelDate(serialNumber: unknown): Date | null {
    const serial = Number(serialNumber);
    if (!serial || isNaN(serial)) return null;
    return new Date(Math.round((serial - 25569) * 86400 * 1000));
}

function formatDate(value: unknown): string {
    const d = getExcelDate(value);
    if (!d) return esc(value);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

function formatRupiah(n: unknown): string {
    return 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');
}

function setText(id: string, value: string) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

/* ---------- Normalisasi Data Booking ---------- */

function getAmount(b: any): number {
    if (typeof b.gross_amount === 'number') return b.gross_amount;
    if (typeof b.amount === 'number') return b.amount;
    if (typeof b.total === 'number') return b.total;

    const flight = b.expand?.flight ?? b.expand?.flightId;
    if (flight) {
        return ((Number(flight.jual) || 0) + (Number(flight.markup) || 0)) * 1000;
    }
    return 0;
}

function getStatus(b: any): 'paid' | 'pending' | 'failed' {
    const raw = String(b.status ?? '').toLowerCase();
    if (['paid', 'settlement', 'capture', 'success', 'lunas'].includes(raw)) return 'paid';
    if (['expire', 'expired', 'cancel', 'deny', 'failure', 'failed', 'falied'].includes(raw)) return 'failed';
    return 'pending';
}

function getDepartureDate(b: any): Date | null {
    const flight = b.expand?.flight ?? b.expand?.flightId;
    if (flight?.dot) return getExcelDate(flight.dot);
    if (b.departure) return new Date(b.departure);
    return null;
}

/* ---------- Data Fetching ---------- */

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
        const userId = pb.authStore.model?.id;
        const ownerFilter = userId ? pb.filter('user = {:userId}', { userId }) : 'id = ""';

        let res;
        try {
            res = await pb.collection('bookings').getList(1, 50, {
                sort: '-created',
                expand: 'flight,flightId',
                filter: ownerFilter,
            });
        } catch {
            res = await pb.collection('bookings').getList(1, 50, {
                expand: 'flight,flightId',
                filter: ownerFilter,
            });
        }
        allBookings = res.items;

        renderBookings();
        renderSummary(allBookings);

    } catch (err: any) {
        console.error('Gagal memuat pesanan:', err.status, err.response);
        list.innerHTML = `
            <div class="bk-empty">
                <h3>Gagal memuat pesanan</h3>
                <p>${esc(err.response?.message || err.message || 'Kesalahan tidak diketahui')}</p>
            </div>`;
    }
}

/* ---------- Render UI: Summary Dashboard ---------- */

export function renderSummary(bookings: any[]): void {
    const active = bookings.filter(b => getStatus(b) !== 'failed');

    const total = active.reduce((sum, b) => sum + getAmount(b), 0);
    const paid = active
        .filter(b => getStatus(b) === 'paid')
        .reduce((sum, b) => sum + getAmount(b), 0);
    const due = total - paid;
    const pendingList = active.filter(b => getStatus(b) === 'pending');
    const percent = total > 0 ? Math.round((paid / total) * 100) : 0;

    const daysToNext = active
        .map(getDepartureDate)
        .filter((d): d is Date => d instanceof Date && !isNaN(d.getTime()))
        .map(d => Math.ceil((d.getTime() - Date.now()) / 86_400_000))
        .filter(d => d >= 0)
        .sort((a, b) => a - b)[0];

    setText('sum-total', formatRupiah(total));
    setText('sum-paid', formatRupiah(paid));
    setText('sum-due', formatRupiah(due));
    setText('sum-percent', `${percent}% lunas`);
    setText('sum-active', String(active.length));
    setText('sum-pending', String(pendingList.length));
    setText('sum-next', daysToNext !== undefined ? `${daysToNext} hari` : '—');

    const bar = document.getElementById('sum-bar');
    if (bar) bar.style.width = `${percent}%`;

    const btn = document.getElementById('btnPayAll') as HTMLButtonElement | null;
    if (!btn) return;

    if (pendingList.length === 0) {
        btn.disabled = true;
        btn.textContent = active.length ? 'Semua lunas' : 'Belum ada pesanan';
        btn.onclick = null;
        return;
    }

    btn.disabled = false;
    btn.textContent = 'Bayar sepenuhnya';
    btn.onclick = () => payAll(pendingList, btn);
}

/* ---------- Render UI: Ticket List ---------- */

function renderBookings() {
    const list = document.querySelector('#aktif .bk-list');
    if (!list) return;

    const rows = activeFilter === 'all'
        ? allBookings
        : allBookings.filter(b => getStatus(b) === activeFilter);

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
    startCountdowns();
}

function cardHTML(b: any): string {
    const f = b.expand?.flight || b.expand?.flightId || {};
    const status = getStatus(b);
    const amount = getAmount(b);
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
                        <span class="bk-price">${formatRupiah(amount)}</span>
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
        const flightId = esc(f.id || '');
        return `
        <div class="bk-card bk-card--expired" data-id="${esc(b.id)}">
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
                        <span class="bk-label">Tagihan dibatalkan</span>
                        <span class="bk-price bk-price--void">${formatRupiah(amount)}</span>
                    </div>
                </div>
                <div class="bk-expired-actions">
                    <button class="bk-rebook" type="button" data-flight-id="${flightId}">Pesan Lagi</button>
                    <button class="bk-delete" type="button" data-booking-id="${esc(b.id)}">Hapus</button>
                </div>
            </div>
        </div>`;
    }

    // pending — countdown shown only when Midtrans has set expiry_time via webhook
    const hasExpiry = !!b.expiry_time;
    const rightCell = hasExpiry
        ? `<span class="bk-label">Sisa waktu</span><span class="bk-countdown">--:--:--</span>`
        : `<span class="bk-note">Selesaikan pembayaran<br>sesuai instruksi</span>`;

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
                    <span class="bk-label">Total tagihan</span>
                    <span class="bk-price">${formatRupiah(amount)}</span>
                </div>
                <div class="bk-info-group bk-text-right">
                    ${rightCell}
                </div>
            </div>
            <button class="bk-pay" data-order="${esc(b.order_id)}" data-booking-id="${esc(b.id)}">Bayar sekarang</button>
        </div>
    </div>`;
}

/* ---------- Countdown ---------- */

function startCountdowns(): void {
    if (tickHandle) window.clearInterval(tickHandle);
    tick();
    tickHandle = window.setInterval(tick, 1000);
}

function tick(): void {
    const justExpired: string[] = [];

    document.querySelectorAll('#aktif .bk-row-bottom[data-expiry]').forEach(wrap => {
        const raw = (wrap as HTMLElement).dataset.expiry;
        const out = wrap.querySelector('.bk-countdown') as HTMLElement | null;
        if (!raw || !out) return;

        const expiry = new Date(raw.replace(' ', 'T') + '+07:00').getTime();
        if (isNaN(expiry)) { out.textContent = '--:--:--'; return; }

        const left = expiry - Date.now();

        if (left <= 0) {
            const bookingId = (wrap.closest('.bk-card') as HTMLElement | null)?.dataset.id;
            if (bookingId) justExpired.push(bookingId);
            return;
        }

        const h = Math.floor(left / 3600000);
        const m = Math.floor((left % 3600000) / 60000);
        const s = Math.floor((left % 60000) / 1000);
        const p = (n: number) => String(n).padStart(2, '0');
        out.textContent = `${p(h)}:${p(m)}:${p(s)}`;
        out.classList.toggle('bk-countdown--urgent', left < 3600000);
    });

    if (justExpired.length > 0) {
        justExpired.forEach(id => {
            const b = allBookings.find(x => x.id === id);
            if (b) b.status = 'expired';
        });
        setTimeout(() => {
            renderBookings();
            renderSummary(allBookings);
        }, 0);
    }
}

/* ---------- Payments (Bulk & Single) ---------- */

async function payAll(pendingList: any[], btn: HTMLButtonElement): Promise<void> {
    if (!pb.authStore.isValid) {
        alert('Sesi Anda telah berakhir. Silakan login kembali.');
        window.location.href = '/login.html';
        return;
    }

    const jumlah = pendingList.length;
    const totalDue = pendingList.reduce((sum, b) => sum + getAmount(b), 0);
    if (!confirm(`Bayar ${jumlah} tagihan sekaligus senilai ${formatRupiah(totalDue)}?`)) return;

    btn.disabled = true;
    btn.textContent = 'Memproses…';

    try {
        const res = await fetch(`${API_BASE}/api/midtrans/token-bulk`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': pb.authStore.token,
            },
            body: JSON.stringify({ bookingIds: pendingList.map(b => b.id) }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `Gagal (${res.status})`);

        if (!(window as any).snap) {
            throw new Error('Modul pembayaran belum termuat. Muat ulang halaman.');
        }

        await loadBookings();

        (window as any).snap.pay(data.token, {
            onSuccess: () => loadBookings(),
            onPending: () => loadBookings(),
            onError: () => { alert('Pembayaran gagal. Silakan coba lagi.'); loadBookings(); },
            onClose: () => loadBookings(),
        });
    } catch (err) {
        console.error('Gagal membuat token pembayaran gabungan:', err);
        alert(err instanceof Error ? err.message : 'Terjadi kesalahan saat memproses pembayaran.');
        resetButton(btn);
    }
}

function resetButton(btn: HTMLButtonElement) {
    btn.disabled = false;
    btn.textContent = 'Bayar sepenuhnya';
}

/* ---------- Event Listeners ---------- */

document.addEventListener('click', async (ev) => {
    const target = ev.target as HTMLElement;

    const filter = target.closest('.bk-filter') as HTMLElement | null;
    if (filter) {
        document.querySelectorAll('.bk-filter').forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
        activeFilter = filter.dataset.status || 'all';
        renderBookings();
        return;
    }

    const btn = target.closest('.bk-pay') as HTMLButtonElement | null;
    if (btn && !btn.disabled) {
        btn.disabled = true;
        btn.textContent = 'Memproses…';

        const resetSingleBtn = () => {
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

            if (!(window as any).snap) {
                throw new Error('Modul pembayaran belum termuat. Muat ulang halaman.');
            }

            await loadBookings();

            (window as any).snap.pay(data.token, {
                onSuccess: () => loadBookings(),
                onPending: () => loadBookings(),
                onError: () => loadBookings(),
                onClose: () => loadBookings(),
            });
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Terjadi kesalahan.');
            resetSingleBtn();
        }
        return;
    }

    const rebookBtn = target.closest('.bk-rebook') as HTMLButtonElement | null;
    if (rebookBtn) {
        const flightId = rebookBtn.dataset.flightId;
        const pembelianTab = document.querySelector('[data-target="pembelian"]') as HTMLElement | null;
        pembelianTab?.click();

        if (flightId) {
            setTimeout(() => {
                const wrapper = document.querySelector(`.ticket-wrapper[data-flight-id="${flightId}"]`);
                if (wrapper) {
                    wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    wrapper.classList.add('ticket-highlight');
                    setTimeout(() => wrapper.classList.remove('ticket-highlight'), 1600);
                }
            }, 150);
        }
        return;
    }

    const deleteBtn = target.closest('.bk-delete') as HTMLButtonElement | null;
    if (deleteBtn) {
        const bookingId = deleteBtn.dataset.bookingId;
        if (!bookingId) return;
        if (!confirm('Hapus pesanan ini dari daftar? Tindakan ini tidak bisa dibatalkan.')) return;

        deleteBtn.disabled = true;
        deleteBtn.textContent = 'Menghapus…';

        try {
            await pb.collection('bookings').delete(bookingId);
            allBookings = allBookings.filter(b => b.id !== bookingId);
            renderBookings();
            renderSummary(allBookings);
        } catch (err) {
            console.error('Gagal menghapus pesanan:', err);
            alert('Gagal menghapus pesanan. Silakan coba lagi.');
            deleteBtn.disabled = false;
            deleteBtn.textContent = 'Hapus';
        }
        return;
    }

    const toggle = target.closest('.bk-leg-toggle') as HTMLElement | null;
    if (toggle) {
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
    }
});

/* ---------- Initialization ---------- */

const aktifTab = document.querySelector('[data-target="aktif"]');
aktifTab?.addEventListener('click', () => {
    if (allBookings.length === 0) loadBookings();
}, { once: true });

if (document.querySelector('#aktif.active-content')) {
    loadBookings();
}