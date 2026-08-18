import { pb } from "../../src/pocketbase";

// Tambahkan 'async' di sini agar kita bisa menggunakan 'await' di dalamnya
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Cek Otentikasi Awal (Apakah ada data login di memori browser?)
    if (!pb.authStore.isValid || !pb.authStore.model) {
        window.location.href = '../login.html';
        return;
    }

    // 2. Sinkronisasi Data (MEMAKSA BROWSER MENGAMBIL DATA TERBARU DARI DATABASE)
    try {
        await pb.collection('users').authRefresh();
    } catch (error) {
        // Jika token sudah tidak valid (misal: akun dihapus), kembalikan ke login
        pb.authStore.clear();
        window.location.href = '../login.html';
        return;
    }

    // Sekarang variabel 'user' dijamin memegang data paling update (termasuk status vendor)
    const user = pb.authStore.model;
    const isAdmin = pb.authStore.isAdmin;
    const vendorStatus = user.vendor || 'user'; 

    // 3. Perbarui Tampilan Profil di Navigasi
    const usernameEl = document.querySelector('#navUsername');
    const emailEl = document.querySelector('#navEmail');

    if (usernameEl) usernameEl.textContent = user.username || 'User';
    if (emailEl) emailEl.textContent = user.email || '';

    // 4. Deklarasi Elemen Utama
    const userUI = document.querySelector('.user-UI') as HTMLElement;
    const vendorPage = document.querySelector('.vendor-page') as HTMLElement;

    // 5. Logika Penampilan Berdasarkan Status
    if (isAdmin || vendorStatus === 'approved') {
        
        // SKENARIO A: VENDOR AKTIF
        // Tampilkan halaman khusus vendor, biarkan user-UI tetap none dari CSS
        if (vendorPage) {
            vendorPage.style.display = 'block'; 
        }

    } else if (vendorStatus === 'pending') {
        
        // SKENARIO B: MENUNGGU PERSETUJUAN
        // Tampilkan layar promosi (flex), ubah gaya tombol
        if (userUI) {
            userUI.style.display = 'flex'; 
            const vendorBtn = userUI.querySelector('.vendor-btn') as HTMLElement;
            
            if (vendorBtn) {
                vendorBtn.textContent = 'Menunggu Persetujuan Admin...';
                vendorBtn.style.pointerEvents = 'none'; // Matikan klik
                vendorBtn.style.backgroundColor = '#f59e0b'; // Warna kuning/oranye untuk pending
                vendorBtn.style.border = 'none';
                vendorBtn.removeAttribute('href');
            }
        }

    } else {
        
        // SKENARIO C: PENGGUNA STANDAR (USER)
        // Tampilkan layar promosi (flex) dan aktifkan fungsi tombol daftar
        if (userUI) {
            userUI.style.display = 'flex';
            
            const vendorBtn = userUI.querySelector('.vendor-btn') as HTMLAnchorElement;
            if (vendorBtn) {
                vendorBtn.addEventListener('click', async (e) => {
                    e.preventDefault(); 
                    
                    const confirmRequest = confirm("Apakah Anda yakin ingin mendaftar sebagai Vendor?");
                    if (!confirmRequest) return;

                    // Ubah teks tombol saat sedang memproses (loading)
                    vendorBtn.textContent = 'Memproses...';
                    vendorBtn.style.pointerEvents = 'none';

                    try {
                        // Kirim data ke PocketBase
                        await pb.collection('users').update(user.id, {
                            vendor: 'pending'
                        });
                        alert("Permintaan berhasil dikirim! Menunggu persetujuan Admin.");
                        window.location.reload(); 
                        
                    } catch (error: any) {
                        console.error("Detail Error Asli dari PocketBase:", error?.response || error);
                        alert("Terjadi kesalahan saat mendaftar vendor. Silakan periksa Console.");
                        
                        // Kembalikan tombol seperti semula jika gagal
                        vendorBtn.textContent = 'Daftar Menjadi Vendor Sekarang';
                        vendorBtn.style.pointerEvents = 'auto';
                    }
                });
            }
        }
    }
});