import { pb } from '../../src/pocketbase';

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

let allHistory: any[] = [];
let loaded = false;

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
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatCreated(value: unknown): string {
    const d = new Date(String(value).replace(' ', 'T'));
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatRupiah(n: unknown): string {
    return 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');
}

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
    if (['expire', 'expired', 'cancel', 'deny', 'failure', 'failed'].includes(raw)) return 'failed';
    return 'pending';
}

export async function loadHistory(): Promise<void> {
    const list = document.querySelector('#riwayat-list');
    if (!list) return;

    if (!pb.authStore.isValid) {
        list.innerHTML = `
            <div class="riwayat-empty">
                <h3>Belum masuk</h3>
                <p>Masuk dulu untuk melihat riwayat pemesanan Anda.</p>
                <button onclick="window.location.href='/login.html'">Masuk</button>
            </div>`;
        return;
    }

    list.innerHTML = `<div class="riwayat-loading">Memuat riwayat…</div>`;

    try {
        // Sama seperti di book.ts: koleksi 'bookings' bisa dibaca publik dan
        // TIDAK otomatis dibatasi per pemilik oleh PocketBase, jadi filter
        // ini wajib supaya riwayat yang tampil benar-benar milik akun ini.
        const userId = pb.authStore.model?.id;
        const ownerFilter = userId ? pb.filter('user = {:userId}', { userId }) : 'id = ""';

        let res;
        try {
            res = await pb.collection('bookings').getList(1, 100, {
                sort: '-created',
                expand: 'flight,flightId',
                filter: ownerFilter,
            });
        } catch {
            res = await pb.collection('bookings').getList(1, 100, {
                expand: 'flight,flightId',
                filter: ownerFilter,
            });
        }

        allHistory = res.items;
        loaded = true;
        renderHistory();
    } catch (err: any) {
        console.error('Gagal memuat riwayat pemesanan:', err.status, err.response);
        list.innerHTML = `
            <div class="riwayat-empty">
                <h3>Gagal memuat riwayat</h3>
                <p>${esc(err.response?.message || err.message || 'Kesalahan tidak diketahui')}</p>
            </div>`;
    }
}

function renderHistory(): void {
    const list = document.querySelector('#riwayat-list');
    if (!list) return;

    if (allHistory.length === 0) {
        list.innerHTML = `
            <div class="riwayat-empty">
                <h3>Belum ada riwayat</h3>
                <p>Pesanan yang pernah Anda buat akan muncul di sini.</p>
                <button onclick="document.querySelector('[data-target=pembelian]').click()">Cari tiket</button>
            </div>`;
        return;
    }

    list.innerHTML = allHistory.map(rowHTML).join('');
}

function rowHTML(b: any): string {
    const f = b.expand?.flight || b.expand?.flightId || {};
    const status = getStatus(b);
    const amount = getAmount(b);
    const vendor = String(f.vendor || 'Garuda');

    return `
    <div class="riwayat-row">
        <div class="riwayat-airline">
            <img src="/assets/Airlines/${encodeURIComponent(vendor)}.png" alt="${esc(vendor)}"
                 onerror="this.onerror=null; this.src='/Airlines/Garuda.png'">
        </div>

        <div class="riwayat-main">
            <span class="riwayat-route">${parseRoute(f.rute1) || '—'}</span>
            <span class="riwayat-meta">${formatCreated(b.created) || formatDate(f.dot)} &middot; ${esc(b.order_id)}</span>
        </div>

        <div class="riwayat-amount">${formatRupiah(amount)}</div>

        <span class="riwayat-status riwayat-status--${status}">${esc(STATUS_TEXT[status])}</span>
    </div>`;
}

const riwayatTab = document.querySelector('[data-target="riwayat"]');
riwayatTab?.addEventListener('click', () => {
    if (!loaded) loadHistory();
});

if (document.querySelector('#riwayat.active-content')) {
    loadHistory();
}
