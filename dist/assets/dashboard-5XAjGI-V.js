import{p as m}from"./pocketbase-BLeLc1eM.js";const V="https://db.zizazu.my.id",H={CGK:"Jakarta (CGK)",JED:"Jeddah (Jeddah)",MED:"Medan (Medan)",SUB:"Surabaya (Surabaya)",JEDJED:"Jeddah (Jeddah)"};function N(e){return H[e]||e}function j(e){const t=Number(e);return!t||isNaN(t)?String(e):new Date(Math.round((t-25569)*86400*1e3)).toLocaleDateString("id-ID",{day:"2-digit",month:"short"})}function p(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function P(e){return e?e.length===6?`${p(N(e.slice(0,3)))} &rarr; ${p(N(e.slice(3,6)))}`:p(e):""}function U(e){return"Rp "+e.toLocaleString("id-ID")}let h=[];const g=new Map;function F(){let e=0;return g.forEach(t=>e+=t.price),e}function E(){const e=document.querySelector("#cart-bar");if(e){if(g.size===0){e.innerHTML="",e.style.display="none";return}e.style.display="flex",e.innerHTML=`
        <div class="cart-info">
            <strong>${g.size}</strong> tiket dipilih &middot;
            <span class="cart-total">${U(F())}</span>
        </div>
        <div class="cart-actions">
            <button class="btn-cart-clear" type="button">Kosongkan</button>
            <button class="btn-cart-checkout" type="button">Pesan Tiket</button>
        </div>
    `}}const C=!m.authStore.isValid,k=m.authStore.record,L=m.authStore.isSuperuser,D=k?k.vendor||"user":null,O=D==="user"&&!L,W=D==="pending"&&!L,X=D==="approved"&&!L,f=document.querySelector("#navUsername"),B=document.querySelector("#navEmail");var K;!C&&k?(f&&(f.textContent=k.username||"User"),B&&(B.textContent=k.email||"")):L?(f&&(f.textContent="Admin"),B&&(B.textContent=((K=m.authStore.record)==null?void 0:K.email)||"")):f&&(f.textContent="Guest");function Q(){const e=document.querySelector("#loginBtn"),t=document.querySelector("#applyVendorBtn"),a=document.querySelector("#pendingVendorStatus"),r=document.querySelector("#vendorDashboardBtn"),i=document.querySelector("#adminPanelBtn");t&&(t.style.display="none"),a&&(a.style.display="none"),r&&(r.style.display="none"),i&&(i.style.display="none"),e&&(e.style.display=C?"block":"none"),O?t&&(t.style.display="block"):W?a&&(a.style.display="block"):X?r&&(r.style.display="block"):L&&i&&(i.style.display="block")}Q();Y();async function Y(){try{h=await m.collection("flights").getFullList(),$(h),Z()}catch(e){console.error("Error fetching flights from PocketBase:",e)}}function $(e){const t=document.querySelector(".ticket-list");if(t){if(e.length===0){t.innerHTML=`
            <div style="text-align:center; padding:20px; color:#666;">
                Tidak ada penerbangan yang ditemukan.
            </div>`;return}t.innerHTML=e.map(a=>{var u;const r=Number(a.jual)||0,i=Number(a.markup)||0,n=(r+i)*1e3,s=n.toLocaleString("id-ID"),d=String(a.vendor||"Garuda"),o=`/Airlines/${encodeURIComponent(d)}.png`;`${a.rute1?P(a.rute1).replace(/&rarr;|&amp;/g," - "):""}`;const l=g.has(a.id);return`
        <div class="ticket-wrapper" data-flight-id="${p(a.id)}" data-price="${n}">
            <div class="ticket-card">
                <div class="airline-info">
                    <img src="${o}" alt="${p(d)}"
                         onerror="this.onerror=null; this.src='/Airlines/Garuda.png'">
                </div>

                <div class="flight-details">
                    <div class="flight-leg">
                        <div class="route">Pergi: ${P(a.rute1)}</div>
                        <div class="time-details">
                            <span><img src="/icon/calender-icon.png" alt=""> ${p(j(a.dot))}</span>
                            <span class="divider">|</span>
                            <span>${p(a.time1)}</span>
                            <span class="divider">|</span>
                            <span class="time-date"><img src="/icon/time-icon.png" alt=""> ${p(a.flight1)}</span>
                        </div>
                    </div>

                    <div class="flight-leg">
                        <div class="route">Pulang: ${P(a.rute2)}</div>
                        <div class="time-details">
                            <span><img src="/icon/plane-icon.png" alt=""> ${p(j(a.dot_turn))}</span>
                            <span class="divider">|</span>
                            <span>${p(a.time2)}</span>
                            <span class="divider">|</span>
                            <span class="time-date"><img src="/icon/time-icon.png" alt=""> ${p(a.flight2)}</span>
                        </div>
                    </div>
                </div>

                <div class="price-container">
                    <div class="duration">Durasi: ${p(a.prog)} (${p(a.day)})</div>
                    <div class="price">Rp ${s}</div>
                </div>

                <div class="action-container">
                    <button class="btn-pilih" type="button">${l?"Batalkan":"Pilih Tiket"}</button>
                </div>
            </div>

            <!-- FORM PENUMPANG — mengisi data sebelum ditambahkan ke pesanan -->
            <div class="booking-form">
                <h3 class="booking-title">Detail Penumpang</h3>

                <div class="form-row">
                    <div class="input-group" style="flex-grow:1;">
                        <label>Nama Lengkap (Sesuai KTP/Paspor)</label>
                        <input type="text" class="booking-input" data-field="name"
                               placeholder="Masukkan nama lengkap" value="${p(((u=g.get(a.id))==null?void 0:u.passengerName)||"")}">
                    </div>
                </div>

                <div class="booking-footer">
                    <div class="total-price">
                        Harga per orang: <span>Rp ${s}</span>
                    </div>
                    <button class="btn-lanjut" type="button">${l?"Perbarui di Pesanan":"Tambah ke Pesanan"}</button>
                </div>
            </div>
        </div>`}).join(""),g.forEach((a,r)=>{const i=t.querySelector(`[data-flight-id="${r}"]`);i==null||i.classList.add("active-booking")})}}function Z(){const e=document.querySelector('input[placeholder*="Search"], .search-bar, input[type="text"]');e&&e.addEventListener("input",t=>{const a=t.target.value.toLowerCase().trim(),r=h.filter(i=>{const n=(i.rute1||"").toLowerCase(),s=(i.rute2||"").toLowerCase(),d=(i.vendor||"").toLowerCase(),o=(i.flight1||"").toLowerCase(),l=(i.flight2||"").toLowerCase();return n.includes(a)||s.includes(a)||d.includes(a)||o.includes(a)||l.includes(a)||a.includes("jakarta")&&(n.includes("cgk")||s.includes("cgk"))||a.includes("jeddah")&&(n.includes("jed")||s.includes("jed"))});$(r)})}const G=document.querySelectorAll(".tab-link"),ee=document.querySelectorAll(".tab-content");G.forEach(e=>{e.addEventListener("click",()=>{G.forEach(a=>a.classList.remove("active")),e.classList.add("active"),ee.forEach(a=>a.classList.remove("active-content"));const t=e.getAttribute("data-target");if(t){const a=document.getElementById(t);a&&a.classList.add("active-content")}})});document.addEventListener("click",async e=>{const t=e.target,a=t.closest(".btn-pilih");if(a){if(C){alert("Silakan login atau daftar terlebih dahulu untuk memesan tiket.");return}const n=a.closest(".ticket-wrapper"),s=n==null?void 0:n.dataset.flightId;if(s&&g.has(s)){g.delete(s),$(h),E();return}n==null||n.classList.toggle("active-booking"),a.innerText=n!=null&&n.classList.contains("active-booking")?"Batalkan":"Pilih Tiket";return}const r=t.closest(".btn-lanjut");if(r){const n=r.closest(".ticket-wrapper");if(!n)return;const s=n.dataset.flightId,d=Number(n.dataset.price)||0,o=n.querySelector('[data-field="name"]'),l=(o==null?void 0:o.value.trim())||"";if(!l){alert("Silakan masukkan Nama Lengkap penumpang terlebih dahulu!"),o==null||o.focus();return}const u=n.querySelector(".route");g.set(s,{flightId:s,routeLabel:(u==null?void 0:u.textContent)||"",passengerName:l,price:d}),$(h),E();return}if(t.closest(".btn-cart-clear")){if(g.size===0||!confirm("Kosongkan semua tiket yang dipilih?"))return;g.clear(),$(h),E();return}const i=t.closest(".btn-cart-checkout");if(i){if(!m.authStore.isValid){alert("Sesi Anda telah berakhir. Silakan login kembali."),window.location.href="/login.html";return}if(g.size===0)return;i.disabled=!0,i.textContent="Memproses…";const n=Array.from(g.values()),s=[];let d=0;for(const l of n)try{const u=await fetch(`${V}/api/midtrans/token`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:m.authStore.token},body:JSON.stringify({flightId:l.flightId,name:l.passengerName})}),z=await u.json().catch(()=>({}));if(!u.ok)throw new Error(z.error||`Gagal (${u.status})`);d++}catch(u){console.error("Gagal membuat pesanan:",l.flightId,u),s.push(l.routeLabel||l.flightId)}g.clear(),E(),s.length>0&&alert(`${d} pesanan berhasil dibuat.
${s.length} gagal:
${s.join(`
`)}`);const o=document.querySelector('[data-target="aktif"]');o==null||o.click()}});window.submitPayment=function(){alert("Konfirmasi pembayaran berhasil dikirim!")};window.requestVendorStatus=async function(){if(!(!k||C))try{if(!confirm("Apakah Anda yakin ingin mendaftar sebagai Vendor?"))return;await m.collection("users").update(k.id,{vendor:"pending"}),alert("Permintaan berhasil dikirim! Menunggu persetujuan Admin."),window.location.reload()}catch(e){console.error("Gagal mengirim permintaan:",e),alert("Terjadi kesalahan saat mendaftar vendor.")}};const R="https://db.zizazu.my.id";let w=[],I="all";const te={CGK:"Jakarta (CGK)",JED:"Jeddah (JED)",MED:"Madinah (MED)",SUB:"Surabaya (SUB)",DPS:"Bali (DPS)"},M={paid:"Lunas",pending:"Menunggu pembayaran",failed:"Kedaluwarsa"};function J(e){return te[e]||e}function c(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ae(e){return e?e.length===6?`${c(J(e.slice(0,3)))} &rarr; ${c(J(e.slice(3,6)))}`:c(e):""}function ne(e){const t=Number(e);return!t||isNaN(t)?null:new Date(Math.round((t-25569)*86400*1e3))}function A(e){const t=ne(e);return t?t.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"}):c(e)}function b(e){return"Rp "+(Number(e)||0).toLocaleString("id-ID")}function v(e,t){const a=document.getElementById(e);a&&(a.textContent=t)}function x(e){var a,r;if(typeof e.gross_amount=="number")return e.gross_amount;if(typeof e.amount=="number")return e.amount;if(typeof e.total=="number")return e.total;const t=((a=e.expand)==null?void 0:a.flight)??((r=e.expand)==null?void 0:r.flightId);return t?((Number(t.jual)||0)+(Number(t.markup)||0))*1e3:0}function S(e){const t=String(e.status??"").toLowerCase();return["paid","settlement","capture","success","lunas"].includes(t)?"paid":["expire","expired","cancel","deny","failure","failed"].includes(t)?"failed":"pending"}async function y(){var t;const e=document.querySelector("#aktif .bk-list");if(e){if(!m.authStore.isValid){e.innerHTML=`
            <div class="bk-empty">
                <h3>Belum masuk</h3>
                <p>Masuk dulu untuk melihat pesanan tiket Anda.</p>
                <button onclick="window.location.href='/login.html'">Masuk</button>
            </div>`;return}try{let a;try{a=await m.collection("bookings").getList(1,50,{sort:"-created",expand:"flight,flightId"})}catch{a=await m.collection("bookings").getList(1,50,{expand:"flight,flightId"})}w=a.items,_(),ie(w)}catch(a){console.error("Gagal memuat pesanan:",a.status,a.response),e.innerHTML=`
            <div class="bk-empty">
                <h3>Gagal memuat pesanan</h3>
                <p>${c(((t=a.response)==null?void 0:t.message)||a.message||"Kesalahan tidak diketahui")}</p>
            </div>`}}}function ie(e){const t=e.filter(l=>S(l)!=="failed"),a=t.reduce((l,u)=>l+x(u),0),r=t.filter(l=>S(l)==="paid").reduce((l,u)=>l+x(u),0),i=a-r,n=t.filter(l=>S(l)==="pending"),s=a>0?Math.round(r/a*100):0;v("sum-total",b(a)),v("sum-paid",b(r)),v("sum-due",b(i)),v("sum-percent",`${s}% lunas`),v("sum-active",String(t.length)),v("sum-pending",String(n.length));const d=document.getElementById("sum-bar");d&&(d.style.width=`${s}%`);const o=document.getElementById("btnPayAll");if(o){if(n.length===0){o.disabled=!0,o.textContent=t.length?"Semua lunas":"Belum ada pesanan",o.onclick=null;return}o.disabled=!1,o.textContent="Bayar sepenuhnya",o.onclick=()=>re(n,o)}}function _(){const e=document.querySelector("#aktif .bk-list");if(!e)return;const t=I==="all"?w:w.filter(a=>S(a)===I);if(t.length===0){e.innerHTML=`
            <div class="bk-empty">
                <h3>Belum ada pesanan</h3>
                <p>Tiket yang Anda pesan akan muncul di sini.</p>
                <button onclick="document.querySelector('[data-target=pembelian]').click()">Cari tiket</button>
            </div>`;return}e.innerHTML=t.map(se).join("")}function se(e){var o,l;const t=((o=e.expand)==null?void 0:o.flight)||((l=e.expand)==null?void 0:l.flightId)||{},a=S(e),r=x(e),i=String(t.vendor||"Garuda"),n=`${c(t.prog)} &middot; ${c(t.day)}`,s=`
        <div class="bk-details">
            <p class="bk-route">${ae(t.rute1)}</p>
            <div class="bk-meta-list">
                <div class="bk-meta">
                    <img src="/icon/calender-icon.png" alt="">
                    <span class="bk-leg-field" data-pergi="${A(t.dot)}" data-pulang="${A(t.dot_turn)}">${A(t.dot)}</span>
                </div>
                <div class="bk-meta">
                    <img src="/icon/time-icon.png" alt="">
                    <span class="bk-leg-field" data-pergi="${c(t.time1)} WIB" data-pulang="${c(t.time2)} WIB">${c(t.time1)} WIB</span>
                </div>
                <div class="bk-meta">
                    <img src="/icon/plane-icon.png" alt="">
                    <span class="bk-leg-field" data-pergi="${c(t.flight1)}" data-pulang="${c(t.flight2)}">${c(t.flight1)}</span>
                </div>
                <div class="bk-meta">
                    <img src="/icon/name-icon.png" alt="">
                    <span>${c(e.passenger_name)}</span>
                </div>
            </div>

            <button class="bk-leg-toggle" type="button" data-leg="pergi">
                <img class="bk-leg-icon" src="/icon/plane-icon.png" alt="">
                <span>penerbangan pergi</span>
            </button>
        </div>

        <div class="bk-divider"></div>`,d=`
        <div class="bk-airline">
            <img src="/assets/Airlines/${encodeURIComponent(i)}.png" alt="${c(i)}"
                 onerror="this.onerror=null; this.src='/Airlines/Garuda.png'">
        </div>`;return a==="paid"?`
        <div class="bk-card" data-id="${c(e.id)}">
            ${d}
            ${s}

            <div class="bk-booking">
                <div class="bk-booking-info">
                    <div class="bk-info-group">
                        <span class="bk-label">Kode pemesanan</span>
                        <span class="bk-value">${c(e.order_id)}</span>
                    </div>
                    <div class="bk-info-group">
                        <span class="bk-label">Total bayar</span>
                        <span class="bk-price">${b(r)}</span>
                    </div>
                    <div class="bk-info-group">
                        <span class="bk-trip">${n}</span>
                        <span class="bk-payment">${c(e.payment_type||"—")}</span>
                    </div>
                </div>
                <div class="bk-booking-actions">
                    <span class="bk-status bk-status--paid">${c(M.paid)}</span>
                    <div class="bk-qr">E-tiket sedang diproses</div>
                    <button class="bk-eticket-btn" disabled>Lihat e-tiket</button>
                </div>
            </div>
        </div>`:a==="failed"?`
        <div class="bk-card bk-card--expired" data-id="${c(e.id)}">
            ${d}
            ${s}

            <div class="bk-booking bk-booking-pending">
                <div class="bk-pending-row">
                    <div class="bk-info-group">
                        <span class="bk-label">Kode pemesanan</span>
                        <span class="bk-value">${c(e.order_id)}</span>
                    </div>
                    <div class="bk-info-group bk-text-right">
                        <span class="bk-status bk-status--failed">${c(M.failed)}</span>
                        <span class="bk-trip">${n}</span>
                    </div>
                </div>
                <div class="bk-pending-row bk-row-bottom">
                    <div class="bk-info-group">
                        <span class="bk-label">Tagihan dibatalkan</span>
                        <span class="bk-price bk-price--void">${b(r)}</span>
                    </div>
                </div>
                <button class="bk-pay bk-pay--expired" disabled>Kedaluwarsa</button>
            </div>
        </div>`:`
    <div class="bk-card" data-id="${c(e.id)}">
        ${d}
        ${s}

        <div class="bk-booking bk-booking-pending">
            <div class="bk-pending-row">
                <div class="bk-info-group">
                    <span class="bk-label">Kode pemesanan</span>
                    <span class="bk-value">${c(e.order_id)}</span>
                </div>
                <div class="bk-info-group bk-text-right">
                    <span class="bk-status bk-status--pending">${c(M.pending)}</span>
                    <span class="bk-trip">${n}</span>
                </div>
            </div>
            <div class="bk-pending-row bk-row-bottom">
                <div class="bk-info-group">
                    <span class="bk-label">Total tagihan</span>
                    <span class="bk-price">${b(r)}</span>
                </div>
                <div class="bk-info-group bk-text-right">
                    <span class="bk-note">Selesaikan pembayaran<br>sesuai instruksi</span>
                </div>
            </div>
            <button class="bk-pay" data-order="${c(e.order_id)}">Bayar sekarang</button>
        </div>
    </div>`}async function re(e,t){if(!m.authStore.isValid){alert("Sesi Anda telah berakhir. Silakan login kembali."),window.location.href="/login.html";return}const a=e.length,r=e.reduce((i,n)=>i+x(n),0);if(confirm(`Bayar ${a} tagihan sekaligus senilai ${b(r)}?`)){t.disabled=!0,t.textContent="Memproses…";try{const i=await fetch(`${R}/api/midtrans/token-bulk`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:m.authStore.token},body:JSON.stringify({bookingIds:e.map(s=>s.id)})}),n=await i.json().catch(()=>({}));if(!i.ok)throw new Error(n.error||`Gagal (${i.status})`);if(!window.snap)throw new Error("Modul pembayaran belum termuat. Muat ulang halaman.");window.snap.pay(n.token,{onSuccess:()=>y(),onPending:()=>y(),onError:()=>{alert("Pembayaran gagal. Silakan coba lagi."),T(t)},onClose:()=>T(t)})}catch(i){console.error("Gagal membuat token pembayaran gabungan:",i),alert(i instanceof Error?i.message:"Terjadi kesalahan saat memproses pembayaran."),T(t)}}}function T(e){e.disabled=!1,e.textContent="Bayar sepenuhnya"}document.addEventListener("click",async e=>{const t=e.target,a=t.closest(".bk-filter");if(a){document.querySelectorAll(".bk-filter").forEach(n=>n.classList.remove("active")),a.classList.add("active"),I=a.dataset.status||"all",_();return}const r=t.closest(".bk-pay");if(r&&!r.disabled){r.disabled=!0,r.textContent="Memproses…";const n=()=>{r.disabled=!1,r.textContent="Bayar sekarang"};try{const s=await fetch(`${R}/api/midtrans/token`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:m.authStore.token},body:JSON.stringify({orderId:r.dataset.order})}),d=await s.json().catch(()=>({}));if(!s.ok||!d.token)throw new Error(d.error||`Gagal memuat pembayaran (${s.status}).`);if(d.orderId&&(r.dataset.order=d.orderId),!window.snap)throw new Error("Modul pembayaran belum termuat. Muat ulang halaman.");window.snap.pay(d.token,{onSuccess:()=>y(),onPending:()=>y(),onError:n,onClose:n})}catch(s){alert(s instanceof Error?s.message:"Terjadi kesalahan."),n()}return}const i=t.closest(".bk-leg-toggle");if(i){const n=i.closest(".bk-card"),s=i.querySelector("span");if(!n||!s)return;const d=i.dataset.leg==="pergi",o=d?"pulang":"pergi";i.dataset.leg=o,s.textContent=d?"penerbangan pulang":"penerbangan pergi",n.querySelectorAll(".bk-leg-field").forEach(l=>{const u=l;u.textContent=u.dataset[o]||""})}});const q=document.querySelector('[data-target="aktif"]');q==null||q.addEventListener("click",()=>{w.length===0&&y()},{once:!0});document.querySelector("#aktif.active-content")&&y();
