import{p as f}from"./pocketbase-BLeLc1eM.js";const et="https://db.zizazu.my.id",at={CGK:"Jakarta (CGK)",JED:"Jeddah (Jeddah)",MED:"Medan (Medan)",SUB:"Surabaya (Surabaya)",JEDJED:"Jeddah (Jeddah)"};function J(t){return at[t]||t}function K(t){const e=Number(t);return!e||isNaN(e)?String(t):new Date(Math.round((e-25569)*86400*1e3)).toLocaleDateString("id-ID",{day:"2-digit",month:"short"})}function m(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function A(t){return t?t.length===6?`${m(J(t.slice(0,3)))} &rarr; ${m(J(t.slice(3,6)))}`:m(t):""}function nt(t){return"Rp "+t.toLocaleString("id-ID")}let b=[],O=new Map;async function U(){try{const t=await f.collection("bookings").getFullList({filter:'status != "failed"',fields:"flight"}),e=new Map;t.forEach(a=>{const r=a.flight;r&&e.set(r,(e.get(r)||0)+1)}),O=e}catch(t){console.error("Gagal memuat jumlah pesanan per penerbangan:",t)}}function it(t){return Number(t.hk)||0}function F(t){const e=it(t);return e<=0?1/0:e-(O.get(t.id)||0)}const g=new Map;function st(){let t=0;return g.forEach(e=>t+=e.price),t}function x(){const t=document.querySelector("#cart-bar");if(t){if(g.size===0){t.innerHTML="",t.style.display="none";return}t.style.display="flex",t.innerHTML=`
        <div class="cart-info">
            <strong>${g.size}</strong> tiket dipilih &middot;
            <span class="cart-total">${nt(st())}</span>
        </div>
        <div class="cart-actions">
            <button class="btn-cart-clear" type="button">Kosongkan</button>
            <button class="btn-cart-checkout" type="button">Pesan Tiket</button>
        </div>
    `}}const I=!f.authStore.isValid,v=f.authStore.record,L=f.authStore.isSuperuser,G=v?v.vendor||"user":null,rt=G==="user"&&!L,ot=G==="pending"&&!L,ct=G==="approved"&&!L,$=document.querySelector("#navUsername"),M=document.querySelector("#navEmail");var H;!I&&v?($&&($.textContent=v.username||"User"),M&&(M.textContent=v.email||"")):L?($&&($.textContent="Admin"),M&&(M.textContent=((H=f.authStore.record)==null?void 0:H.email)||"")):$&&($.textContent="Guest");function lt(){const t=document.querySelector("#loginBtn"),e=document.querySelector("#applyVendorBtn"),a=document.querySelector("#pendingVendorStatus"),r=document.querySelector("#vendorDashboardBtn"),n=document.querySelector("#adminPanelBtn");e&&(e.style.display="none"),a&&(a.style.display="none"),r&&(r.style.display="none"),n&&(n.style.display="none"),t&&(t.style.display=I?"block":"none"),rt?e&&(e.style.display="block"):ot?a&&(a.style.display="block"):ct?r&&(r.style.display="block"):L&&n&&(n.style.display="block")}lt();dt();async function dt(){try{b=await f.collection("flights").getFullList(),await U(),w(b),ut()}catch(t){console.error("Error fetching flights from PocketBase:",t)}}function w(t){const e=document.querySelector(".ticket-list");if(e){if(t.length===0){e.innerHTML=`
            <div style="text-align:center; padding:20px; color:#666;">
                Tidak ada penerbangan yang ditemukan.
            </div>`;return}e.innerHTML=t.map(a=>{var _;const r=Number(a.jual)||0,n=Number(a.markup)||0,i=(r+n)*1e3,o=i.toLocaleString("id-ID"),c=String(a.vendor||"Garuda"),l=`/Airlines/${encodeURIComponent(c)}.png`;`${a.rute1?A(a.rute1).replace(/&rarr;|&amp;/g," - "):""}`;const d=g.has(a.id),s=F(a),p=s<=0,S=!p&&s!==1/0&&s<=5;let B=d?"Batalkan":"Pilih Tiket";return p&&!d&&(B="Tiket Habis"),`
        <div class="ticket-wrapper" data-flight-id="${m(a.id)}" data-price="${i}">
            <div class="ticket-card">
                <div class="airline-info">
                    <img src="${l}" alt="${m(c)}"
                         onerror="this.onerror=null; this.src='/Airlines/Garuda.png'">
                </div>

                <div class="flight-details">
                    <div class="flight-leg">
                        <div class="route">Pergi: ${A(a.rute1)}</div>
                        <div class="time-details">
                            <span><img src="/icon/calender-icon.png" alt=""> ${m(K(a.dot))}</span>
                            <span class="divider">|</span>
                            <span>${m(a.time1)}</span>
                            <span class="divider">|</span>
                            <span class="time-date"><img src="/icon/time-icon.png" alt=""> ${m(a.flight1)}</span>
                        </div>
                    </div>

                    <div class="flight-leg">
                        <div class="route">Pulang: ${A(a.rute2)}</div>
                        <div class="time-details">
                            <span><img src="/icon/plane-icon.png" alt=""> ${m(K(a.dot_turn))}</span>
                            <span class="divider">|</span>
                            <span>${m(a.time2)}</span>
                            <span class="divider">|</span>
                            <span class="time-date"><img src="/icon/time-icon.png" alt=""> ${m(a.flight2)}</span>
                        </div>
                    </div>
                </div>

                <div class="price-container">
                    <div class="duration">Durasi: ${m(a.prog)} (${m(a.day)})</div>
                    ${S?`<div class="duration" style="color:#D97706;font-weight:600;">Sisa ${s} kursi</div>`:""}
                    <div class="price">Rp ${o}</div>
                </div>

                <div class="action-container">
                    <button class="btn-pilih" type="button" ${p&&!d?"disabled":""}>${m(B)}</button>
                </div>
            </div>

            <!-- FORM PENUMPANG — mengisi data sebelum ditambahkan ke pesanan -->
            <div class="booking-form">
                <h3 class="booking-title">Detail Penumpang</h3>

                <div class="form-row">
                    <div class="input-group" style="flex-grow:1;">
                        <label>Nama Lengkap (Sesuai KTP/Paspor)</label>
                        <input type="text" class="booking-input" data-field="name"
                               placeholder="Masukkan nama lengkap" value="${m(((_=g.get(a.id))==null?void 0:_.passengerName)||"")}">
                    </div>
                </div>

                <div class="booking-footer">
                    <div class="total-price">
                        Harga per orang: <span>Rp ${o}</span>
                    </div>
                    <button class="btn-lanjut" type="button">${d?"Perbarui di Pesanan":"Tambah ke Pesanan"}</button>
                </div>
            </div>
        </div>`}).join(""),g.forEach((a,r)=>{const n=e.querySelector(`[data-flight-id="${r}"]`);n==null||n.classList.add("active-booking")})}}function ut(){const t=document.querySelector('input[placeholder*="Search"], .search-bar, input[type="text"]');t&&t.addEventListener("input",e=>{const a=e.target.value.toLowerCase().trim(),r=b.filter(n=>{const i=(n.rute1||"").toLowerCase(),o=(n.rute2||"").toLowerCase(),c=(n.vendor||"").toLowerCase(),l=(n.flight1||"").toLowerCase(),d=(n.flight2||"").toLowerCase();return i.includes(a)||o.includes(a)||c.includes(a)||l.includes(a)||d.includes(a)||a.includes("jakarta")&&(i.includes("cgk")||o.includes("cgk"))||a.includes("jeddah")&&(i.includes("jed")||o.includes("jed"))});w(r)})}const R=document.querySelectorAll(".tab-link"),pt=document.querySelectorAll(".tab-content");R.forEach(t=>{t.addEventListener("click",()=>{R.forEach(a=>a.classList.remove("active")),t.classList.add("active"),pt.forEach(a=>a.classList.remove("active-content"));const e=t.getAttribute("data-target");if(e){const a=document.getElementById(e);a&&a.classList.add("active-content")}})});document.addEventListener("click",async t=>{const e=t.target,a=e.closest(".btn-pilih");if(a){if(I){alert("Silakan login atau daftar terlebih dahulu untuk memesan tiket.");return}const i=a.closest(".ticket-wrapper"),o=i==null?void 0:i.dataset.flightId;if(o&&g.has(o)){g.delete(o),w(b),x();return}i==null||i.classList.toggle("active-booking"),a.innerText=i!=null&&i.classList.contains("active-booking")?"Batalkan":"Pilih Tiket";return}const r=e.closest(".btn-lanjut");if(r){const i=r.closest(".ticket-wrapper");if(!i)return;const o=i.dataset.flightId,c=Number(i.dataset.price)||0,l=i.querySelector('[data-field="name"]'),d=(l==null?void 0:l.value.trim())||"";if(!d){alert("Silakan masukkan Nama Lengkap penumpang terlebih dahulu!"),l==null||l.focus();return}const s=i.querySelector(".route");g.set(o,{flightId:o,routeLabel:(s==null?void 0:s.textContent)||"",passengerName:d,price:c}),w(b),x();return}if(e.closest(".btn-cart-clear")){if(g.size===0||!confirm("Kosongkan semua tiket yang dipilih?"))return;g.clear(),w(b),x();return}const n=e.closest(".btn-cart-checkout");if(n){if(!f.authStore.isValid){alert("Sesi Anda telah berakhir. Silakan login kembali."),window.location.href="/login.html";return}if(g.size===0)return;n.disabled=!0,n.textContent="Memproses…",await U();const i=[];if(g.forEach((s,p)=>{const S=b.find(B=>B.id===p);S&&F(S)<=0&&(i.push(s.routeLabel||p),g.delete(p))}),i.length>0&&(alert(`Maaf, tiket berikut sudah habis dan dihapus dari pesanan:
${i.join(`
`)}`),w(b),x(),g.size===0)){n.disabled=!1,n.textContent="Pesan Tiket";return}const o=Array.from(g.values()),c=[];let l=0;for(const s of o)try{const p=await fetch(`${et}/api/midtrans/token`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:f.authStore.token},body:JSON.stringify({flightId:s.flightId,name:s.passengerName})}),S=await p.json().catch(()=>({}));if(!p.ok)throw new Error(S.error||`Gagal (${p.status})`);l++}catch(p){console.error("Gagal membuat pesanan:",s.flightId,p),c.push(s.routeLabel||s.flightId)}g.clear(),x(),c.length>0&&alert(`${l} pesanan berhasil dibuat.
${c.length} gagal:
${c.join(`
`)}`);const d=document.querySelector('[data-target="aktif"]');d==null||d.click()}});window.submitPayment=function(){alert("Konfirmasi pembayaran berhasil dikirim!")};window.requestVendorStatus=async function(){if(!(!v||I))try{if(!confirm("Apakah Anda yakin ingin mendaftar sebagai Vendor?"))return;await f.collection("users").update(v.id,{vendor:"pending"}),alert("Permintaan berhasil dikirim! Menunggu persetujuan Admin."),window.location.reload()}catch(t){console.error("Gagal mengirim permintaan:",t),alert("Terjadi kesalahan saat mendaftar vendor.")}};const W="https://db.zizazu.my.id";let E=[],j="all",D;const X="tp_midtrans_accessed";function Y(){try{const t=localStorage.getItem(X);return new Set(t?JSON.parse(t):[])}catch{return new Set}}function Q(t){const e=Y();t.forEach(a=>e.add(a));try{localStorage.setItem(X,JSON.stringify([...e]))}catch{}}const gt={CGK:"Jakarta (CGK)",JED:"Jeddah (JED)",MED:"Madinah (MED)",SUB:"Surabaya (SUB)",DPS:"Bali (DPS)"},P={paid:"Lunas",pending:"Menunggu pembayaran",failed:"Kedaluwarsa"};function z(t){return gt[t]||t}function u(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function mt(t){return t?t.length===6?`${u(z(t.slice(0,3)))} &rarr; ${u(z(t.slice(3,6)))}`:u(t):""}function Z(t){const e=Number(t);return!e||isNaN(e)?null:new Date(Math.round((e-25569)*86400*1e3))}function q(t){const e=Z(t);return e?e.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"}):u(t)}function y(t){return"Rp "+(Number(t)||0).toLocaleString("id-ID")}function h(t,e){const a=document.getElementById(t);a&&(a.textContent=e)}function T(t){var a,r;if(typeof t.gross_amount=="number")return t.gross_amount;if(typeof t.amount=="number")return t.amount;if(typeof t.total=="number")return t.total;const e=((a=t.expand)==null?void 0:a.flight)??((r=t.expand)==null?void 0:r.flightId);return e?((Number(e.jual)||0)+(Number(e.markup)||0))*1e3:0}function C(t){const e=String(t.status??"").toLowerCase();return["paid","settlement","capture","success","lunas"].includes(e)?"paid":["expire","expired","cancel","deny","failure","failed"].includes(e)?"failed":"pending"}function ft(t){var a,r;const e=((a=t.expand)==null?void 0:a.flight)??((r=t.expand)==null?void 0:r.flightId);return e!=null&&e.dot?Z(e.dot):t.departure?new Date(t.departure):null}async function k(){var e;const t=document.querySelector("#aktif .bk-list");if(t){if(!f.authStore.isValid){t.innerHTML=`
            <div class="bk-empty">
                <h3>Belum masuk</h3>
                <p>Masuk dulu untuk melihat pesanan tiket Anda.</p>
                <button onclick="window.location.href='/login.html'">Masuk</button>
            </div>`;return}try{let a;try{a=await f.collection("bookings").getList(1,50,{sort:"-created",expand:"flight,flightId"})}catch{a=await f.collection("bookings").getList(1,50,{expand:"flight,flightId"})}E=a.items,tt(),kt(E)}catch(a){console.error("Gagal memuat pesanan:",a.status,a.response),t.innerHTML=`
            <div class="bk-empty">
                <h3>Gagal memuat pesanan</h3>
                <p>${u(((e=a.response)==null?void 0:e.message)||a.message||"Kesalahan tidak diketahui")}</p>
            </div>`}}}function kt(t){const e=t.filter(s=>C(s)!=="failed"),a=e.reduce((s,p)=>s+T(p),0),r=e.filter(s=>C(s)==="paid").reduce((s,p)=>s+T(p),0),n=a-r,i=e.filter(s=>C(s)==="pending"),o=a>0?Math.round(r/a*100):0,c=e.map(ft).filter(s=>s instanceof Date&&!isNaN(s.getTime())).map(s=>Math.ceil((s.getTime()-Date.now())/864e5)).filter(s=>s>=0).sort((s,p)=>s-p)[0];h("sum-total",y(a)),h("sum-paid",y(r)),h("sum-due",y(n)),h("sum-percent",`${o}% lunas`),h("sum-active",String(e.length)),h("sum-pending",String(i.length)),h("sum-next",c!==void 0?`${c} hari`:"—");const l=document.getElementById("sum-bar");l&&(l.style.width=`${o}%`);const d=document.getElementById("btnPayAll");if(d){if(i.length===0){d.disabled=!0,d.textContent=e.length?"Semua lunas":"Belum ada pesanan",d.onclick=null;return}d.disabled=!1,d.textContent="Bayar sepenuhnya",d.onclick=()=>vt(i,d)}}function tt(){const t=document.querySelector("#aktif .bk-list");if(!t)return;const e=j==="all"?E:E.filter(a=>C(a)===j);if(e.length===0){t.innerHTML=`
            <div class="bk-empty">
                <h3>Belum ada pesanan</h3>
                <p>Tiket yang Anda pesan akan muncul di sini.</p>
                <button onclick="document.querySelector('[data-target=pembelian]').click()">Cari tiket</button>
            </div>`;return}t.innerHTML=e.map(bt).join(""),ht()}function bt(t){var s,p;const e=((s=t.expand)==null?void 0:s.flight)||((p=t.expand)==null?void 0:p.flightId)||{},a=C(t),r=T(t),n=String(e.vendor||"Garuda"),i=`${u(e.prog)} &middot; ${u(e.day)}`,o=`
        <div class="bk-details">
            <p class="bk-route">${mt(e.rute1)}</p>
            <div class="bk-meta-list">
                <div class="bk-meta">
                    <img src="/icon/calender-icon.png" alt="">
                    <span class="bk-leg-field" data-pergi="${q(e.dot)}" data-pulang="${q(e.dot_turn)}">${q(e.dot)}</span>
                </div>
                <div class="bk-meta">
                    <img src="/icon/time-icon.png" alt="">
                    <span class="bk-leg-field" data-pergi="${u(e.time1)} WIB" data-pulang="${u(e.time2)} WIB">${u(e.time1)} WIB</span>
                </div>
                <div class="bk-meta">
                    <img src="/icon/plane-icon.png" alt="">
                    <span class="bk-leg-field" data-pergi="${u(e.flight1)}" data-pulang="${u(e.flight2)}">${u(e.flight1)}</span>
                </div>
                <div class="bk-meta">
                    <img src="/icon/name-icon.png" alt="">
                    <span>${u(t.passenger_name)}</span>
                </div>
            </div>

            <button class="bk-leg-toggle" type="button" data-leg="pergi">
                <img class="bk-leg-icon" src="/icon/plane-icon.png" alt="">
                <span>penerbangan pergi</span>
            </button>
        </div>

        <div class="bk-divider"></div>`,c=`
        <div class="bk-airline">
            <img src="/assets/Airlines/${encodeURIComponent(n)}.png" alt="${u(n)}"
                 onerror="this.onerror=null; this.src='/Airlines/Garuda.png'">
        </div>`;if(a==="paid")return`
        <div class="bk-card" data-id="${u(t.id)}">
            ${c}
            ${o}

            <div class="bk-booking">
                <div class="bk-booking-info">
                    <div class="bk-info-group">
                        <span class="bk-label">Kode pemesanan</span>
                        <span class="bk-value">${u(t.order_id)}</span>
                    </div>
                    <div class="bk-info-group">
                        <span class="bk-label">Total bayar</span>
                        <span class="bk-price">${y(r)}</span>
                    </div>
                    <div class="bk-info-group">
                        <span class="bk-trip">${i}</span>
                        <span class="bk-payment">${u(t.payment_type||"—")}</span>
                    </div>
                </div>
                <div class="bk-booking-actions">
                    <span class="bk-status bk-status--paid">${u(P.paid)}</span>
                    <div class="bk-qr">E-tiket sedang diproses</div>
                    <button class="bk-eticket-btn" disabled>Lihat e-tiket</button>
                </div>
            </div>
        </div>`;if(a==="failed")return`
        <div class="bk-card bk-card--expired" data-id="${u(t.id)}">
            ${c}
            ${o}

            <div class="bk-booking bk-booking-pending">
                <div class="bk-pending-row">
                    <div class="bk-info-group">
                        <span class="bk-label">Kode pemesanan</span>
                        <span class="bk-value">${u(t.order_id)}</span>
                    </div>
                    <div class="bk-info-group bk-text-right">
                        <span class="bk-status bk-status--failed">${u(P.failed)}</span>
                        <span class="bk-trip">${i}</span>
                    </div>
                </div>
                <div class="bk-pending-row bk-row-bottom">
                    <div class="bk-info-group">
                        <span class="bk-label">Tagihan dibatalkan</span>
                        <span class="bk-price bk-price--void">${y(r)}</span>
                    </div>
                </div>
                <button class="bk-pay bk-pay--expired" disabled>Kedaluwarsa</button>
            </div>
        </div>`;const l=Y().has(t.id),d=l?'<span class="bk-label">Sisa waktu</span><span class="bk-countdown">--:--:--</span>':'<span class="bk-note">Selesaikan pembayaran<br>sesuai instruksi</span>';return`
    <div class="bk-card" data-id="${u(t.id)}">
        ${c}
        ${o}

        <div class="bk-booking bk-booking-pending">
            <div class="bk-pending-row">
                <div class="bk-info-group">
                    <span class="bk-label">Kode pemesanan</span>
                    <span class="bk-value">${u(t.order_id)}</span>
                </div>
                <div class="bk-info-group bk-text-right">
                    <span class="bk-status bk-status--pending">${u(P.pending)}</span>
                    <span class="bk-trip">${i}</span>
                </div>
            </div>
            <div class="bk-pending-row bk-row-bottom" data-expiry="${l?u(t.expiry_time||""):""}">
                <div class="bk-info-group">
                    <span class="bk-label">Total tagihan</span>
                    <span class="bk-price">${y(r)}</span>
                </div>
                <div class="bk-info-group bk-text-right">
                    ${d}
                </div>
            </div>
            <button class="bk-pay" data-order="${u(t.order_id)}" data-booking-id="${u(t.id)}">Bayar sekarang</button>
        </div>
    </div>`}function ht(){D&&window.clearInterval(D),V(),D=window.setInterval(V,1e3)}function V(){document.querySelectorAll("#aktif .bk-row-bottom[data-expiry]").forEach(t=>{var d;const e=t.dataset.expiry,a=t.querySelector(".bk-countdown");if(!e||!a)return;const r=new Date(e.replace(" ","T")+"+07:00").getTime();if(isNaN(r)){a.textContent="--:--:--";return}const n=r-Date.now();if(n<=0){a.textContent="00:00:00",a.classList.add("bk-countdown--urgent");const s=(d=t.closest(".bk-booking"))==null?void 0:d.querySelector(".bk-pay");s&&!s.disabled&&(s.disabled=!0,s.textContent="Kedaluwarsa",s.classList.add("bk-pay--expired"));return}const i=Math.floor(n/36e5),o=Math.floor(n%36e5/6e4),c=Math.floor(n%6e4/1e3),l=s=>String(s).padStart(2,"0");a.textContent=`${l(i)}:${l(o)}:${l(c)}`,a.classList.toggle("bk-countdown--urgent",n<36e5)})}async function vt(t,e){if(!f.authStore.isValid){alert("Sesi Anda telah berakhir. Silakan login kembali."),window.location.href="/login.html";return}const a=t.length,r=t.reduce((n,i)=>n+T(i),0);if(confirm(`Bayar ${a} tagihan sekaligus senilai ${y(r)}?`)){e.disabled=!0,e.textContent="Memproses…";try{const n=await fetch(`${W}/api/midtrans/token-bulk`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:f.authStore.token},body:JSON.stringify({bookingIds:t.map(o=>o.id)})}),i=await n.json().catch(()=>({}));if(!n.ok)throw new Error(i.error||`Gagal (${n.status})`);if(!window.snap)throw new Error("Modul pembayaran belum termuat. Muat ulang halaman.");Q(t.map(o=>o.id)),await k(),window.snap.pay(i.token,{onSuccess:()=>k(),onPending:()=>k(),onError:()=>{alert("Pembayaran gagal. Silakan coba lagi."),k()},onClose:()=>k()})}catch(n){console.error("Gagal membuat token pembayaran gabungan:",n),alert(n instanceof Error?n.message:"Terjadi kesalahan saat memproses pembayaran."),yt(e)}}}function yt(t){t.disabled=!1,t.textContent="Bayar sepenuhnya"}document.addEventListener("click",async t=>{const e=t.target,a=e.closest(".bk-filter");if(a){document.querySelectorAll(".bk-filter").forEach(i=>i.classList.remove("active")),a.classList.add("active"),j=a.dataset.status||"all",tt();return}const r=e.closest(".bk-pay");if(r&&!r.disabled){r.disabled=!0,r.textContent="Memproses…";const i=r.dataset.bookingId||"",o=()=>{r.disabled=!1,r.textContent="Bayar sekarang"};try{const c=await fetch(`${W}/api/midtrans/token`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:f.authStore.token},body:JSON.stringify({orderId:r.dataset.order})}),l=await c.json().catch(()=>({}));if(!c.ok||!l.token)throw new Error(l.error||`Gagal memuat pembayaran (${c.status}).`);if(!window.snap)throw new Error("Modul pembayaran belum termuat. Muat ulang halaman.");i&&Q([i]),await k(),window.snap.pay(l.token,{onSuccess:()=>k(),onPending:()=>k(),onError:()=>k(),onClose:()=>k()})}catch(c){alert(c instanceof Error?c.message:"Terjadi kesalahan."),o()}return}const n=e.closest(".bk-leg-toggle");if(n){const i=n.closest(".bk-card"),o=n.querySelector("span");if(!i||!o)return;const c=n.dataset.leg==="pergi",l=c?"pulang":"pergi";n.dataset.leg=l,o.textContent=c?"penerbangan pulang":"penerbangan pergi",i.querySelectorAll(".bk-leg-field").forEach(d=>{const s=d;s.textContent=s.dataset[l]||""})}});const N=document.querySelector('[data-target="aktif"]');N==null||N.addEventListener("click",()=>{E.length===0&&k()},{once:!0});document.querySelector("#aktif.active-content")&&k();
