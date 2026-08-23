import{p as m}from"./pocketbase-BLeLc1eM.js";const et="https://db.zizazu.my.id",at={CGK:"Jakarta (CGK)",JED:"Jeddah (Jeddah)",MED:"Medan (Medan)",SUB:"Surabaya (Surabaya)",JEDJED:"Jeddah (Jeddah)"};function J(t){return at[t]||t}function K(t){const e=Number(t);return!e||isNaN(e)?String(t):new Date(Math.round((e-25569)*86400*1e3)).toLocaleDateString("id-ID",{day:"2-digit",month:"short"})}function f(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function A(t){return t?t.length===6?`${f(J(t.slice(0,3)))} &rarr; ${f(J(t.slice(3,6)))}`:f(t):""}function nt(t){return"Rp "+t.toLocaleString("id-ID")}let b=[],O=new Map;async function U(){try{const t=await m.collection("bookings").getFullList({filter:'status != "failed"',fields:"flight"}),e=new Map;t.forEach(a=>{const n=a.flight;n&&e.set(n,(e.get(n)||0)+1)}),O=e}catch(t){console.error("Gagal memuat jumlah pesanan per penerbangan:",t)}}function it(t){return Number(t.hk)||0}function F(t){const e=it(t);return e<=0?1/0:e-(O.get(t.id)||0)}const g=new Map;function st(){let t=0;return g.forEach(e=>t+=e.price),t}function x(){const t=document.querySelector("#cart-bar");if(t){if(g.size===0){t.innerHTML="",t.style.display="none";return}t.style.display="flex",t.innerHTML=`
        <div class="cart-info">
            <strong>${g.size}</strong> tiket dipilih &middot;
            <span class="cart-total">${nt(st())}</span>
        </div>
        <div class="cart-actions">
            <button class="btn-cart-clear" type="button">Kosongkan</button>
            <button class="btn-cart-checkout" type="button">Pesan Tiket</button>
        </div>
    `}}const T=!m.authStore.isValid,v=m.authStore.model,L=m.authStore.isAdmin,G=v?v.vendor||"user":null,rt=G==="user"&&!L,ot=G==="pending"&&!L,lt=G==="approved"&&!L,$=document.querySelector("#navUsername"),M=document.querySelector("#navEmail");var H;!T&&v?($&&($.textContent=v.username||"User"),M&&(M.textContent=v.email||"")):L?($&&($.textContent="Admin"),M&&(M.textContent=((H=m.authStore.model)==null?void 0:H.email)||"")):$&&($.textContent="Guest");function ct(){const t=document.querySelector("#loginBtn"),e=document.querySelector("#applyVendorBtn"),a=document.querySelector("#pendingVendorStatus"),n=document.querySelector("#vendorDashboardBtn"),s=document.querySelector("#adminPanelBtn");e&&(e.style.display="none"),a&&(a.style.display="none"),n&&(n.style.display="none"),s&&(s.style.display="none"),t&&(t.style.display=T?"block":"none"),rt?e&&(e.style.display="block"):ot?a&&(a.style.display="block"):lt?n&&(n.style.display="block"):L&&s&&(s.style.display="block")}ct();dt();async function dt(){try{b=await m.collection("flights").getFullList(),await U(),w(b),ut()}catch(t){console.error("Error fetching flights from PocketBase:",t)}}function w(t){const e=document.querySelector(".ticket-list");if(e){if(t.length===0){e.innerHTML=`
            <div style="text-align:center; padding:20px; color:#666;">
                Tidak ada penerbangan yang ditemukan.
            </div>`;return}e.innerHTML=t.map(a=>{var _;const n=Number(a.jual)||0,s=Number(a.markup)||0,i=(n+s)*1e3,o=i.toLocaleString("id-ID"),l=String(a.vendor||"Garuda"),c=`/Airlines/${encodeURIComponent(l)}.png`;`${a.rute1?A(a.rute1).replace(/&rarr;|&amp;/g," - "):""}`;const d=g.has(a.id),r=F(a),p=r<=0,S=!p&&r!==1/0&&r<=5;let B=d?"Batalkan":"Pilih Tiket";return p&&!d&&(B="Tiket Habis"),`
        <div class="ticket-wrapper" data-flight-id="${f(a.id)}" data-price="${i}">
            <div class="ticket-card">
                <div class="airline-info">
                    <img src="${c}" alt="${f(l)}"
                         onerror="this.onerror=null; this.src='/Airlines/Garuda.png'">
                </div>

                <div class="flight-details">
                    <div class="flight-leg">
                        <div class="route">Pergi: ${A(a.rute1)}</div>
                        <div class="time-details">
                            <span><img src="/icon/calender-icon.png" alt=""> ${f(K(a.dot))}</span>
                            <span class="divider">|</span>
                            <span>${f(a.time1)}</span>
                            <span class="divider">|</span>
                            <span class="time-date"><img src="/icon/time-icon.png" alt=""> ${f(a.flight1)}</span>
                        </div>
                    </div>

                    <div class="flight-leg">
                        <div class="route">Pulang: ${A(a.rute2)}</div>
                        <div class="time-details">
                            <span><img src="/icon/plane-icon.png" alt=""> ${f(K(a.dot_turn))}</span>
                            <span class="divider">|</span>
                            <span>${f(a.time2)}</span>
                            <span class="divider">|</span>
                            <span class="time-date"><img src="/icon/time-icon.png" alt=""> ${f(a.flight2)}</span>
                        </div>
                    </div>
                </div>

                <div class="price-container">
                    <div class="duration">Durasi: ${f(a.prog)} (${f(a.day)})</div>
                    ${S?`<div class="duration" style="color:#D97706;font-weight:600;">Sisa ${r} kursi</div>`:""}
                    <div class="price">Rp ${o}</div>
                </div>

                <div class="action-container">
                    <button class="btn-pilih" type="button" ${p&&!d?"disabled":""}>${f(B)}</button>
                </div>
            </div>

            <!-- FORM PENUMPANG — mengisi data sebelum ditambahkan ke pesanan -->
            <div class="booking-form">
                <h3 class="booking-title">Detail Penumpang</h3>

                <div class="form-row">
                    <div class="input-group" style="flex-grow:1;">
                        <label>Nama Lengkap (Sesuai KTP/Paspor)</label>
                        <input type="text" class="booking-input" data-field="name"
                               placeholder="Masukkan nama lengkap" value="${f(((_=g.get(a.id))==null?void 0:_.passengerName)||"")}">
                    </div>
                </div>

                <div class="booking-footer">
                    <div class="total-price">
                        Harga per orang: <span>Rp ${o}</span>
                    </div>
                    <button class="btn-lanjut" type="button">${d?"Perbarui di Pesanan":"Tambah ke Pesanan"}</button>
                </div>
            </div>
        </div>`}).join(""),g.forEach((a,n)=>{const s=e.querySelector(`[data-flight-id="${n}"]`);s==null||s.classList.add("active-booking")})}}function ut(){const t=document.querySelector('input[placeholder*="Search"], .search-bar, input[type="text"]');t&&t.addEventListener("input",e=>{const a=e.target.value.toLowerCase().trim(),n=b.filter(s=>{const i=(s.rute1||"").toLowerCase(),o=(s.rute2||"").toLowerCase(),l=(s.vendor||"").toLowerCase(),c=(s.flight1||"").toLowerCase(),d=(s.flight2||"").toLowerCase();return i.includes(a)||o.includes(a)||l.includes(a)||c.includes(a)||d.includes(a)||a.includes("jakarta")&&(i.includes("cgk")||o.includes("cgk"))||a.includes("jeddah")&&(i.includes("jed")||o.includes("jed"))});w(n)})}const R=document.querySelectorAll(".tab-link"),pt=document.querySelectorAll(".tab-content");R.forEach(t=>{t.addEventListener("click",()=>{R.forEach(a=>a.classList.remove("active")),t.classList.add("active"),pt.forEach(a=>a.classList.remove("active-content"));const e=t.getAttribute("data-target");if(e){const a=document.getElementById(e);a&&a.classList.add("active-content")}})});document.addEventListener("click",async t=>{const e=t.target,a=e.closest(".btn-pilih");if(a){if(T){alert("Silakan login atau daftar terlebih dahulu untuk memesan tiket.");return}const i=a.closest(".ticket-wrapper"),o=i==null?void 0:i.dataset.flightId;if(o&&g.has(o)){g.delete(o),w(b),x();return}i==null||i.classList.toggle("active-booking"),a.innerText=i!=null&&i.classList.contains("active-booking")?"Batalkan":"Pilih Tiket";return}const n=e.closest(".btn-lanjut");if(n){const i=n.closest(".ticket-wrapper");if(!i)return;const o=i.dataset.flightId,l=Number(i.dataset.price)||0,c=i.querySelector('[data-field="name"]'),d=(c==null?void 0:c.value.trim())||"";if(!d){alert("Silakan masukkan Nama Lengkap penumpang terlebih dahulu!"),c==null||c.focus();return}const r=i.querySelector(".route");g.set(o,{flightId:o,routeLabel:(r==null?void 0:r.textContent)||"",passengerName:d,price:l}),w(b),x();return}if(e.closest(".btn-cart-clear")){if(g.size===0||!confirm("Kosongkan semua tiket yang dipilih?"))return;g.clear(),w(b),x();return}const s=e.closest(".btn-cart-checkout");if(s){if(!m.authStore.isValid){alert("Sesi Anda telah berakhir. Silakan login kembali."),window.location.href="/login.html";return}if(g.size===0)return;s.disabled=!0,s.textContent="Memproses…",await U();const i=[];if(g.forEach((r,p)=>{const S=b.find(B=>B.id===p);S&&F(S)<=0&&(i.push(r.routeLabel||p),g.delete(p))}),i.length>0&&(alert(`Maaf, tiket berikut sudah habis dan dihapus dari pesanan:
${i.join(`
`)}`),w(b),x(),g.size===0)){s.disabled=!1,s.textContent="Pesan Tiket";return}const o=Array.from(g.values()),l=[];let c=0;for(const r of o)try{const p=await fetch(`${et}/api/midtrans/token`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:m.authStore.token},body:JSON.stringify({flightId:r.flightId,name:r.passengerName})}),S=await p.json().catch(()=>({}));if(!p.ok)throw new Error(S.error||`Gagal (${p.status})`);c++}catch(p){console.error("Gagal membuat pesanan:",r.flightId,p),l.push(r.routeLabel||r.flightId)}g.clear(),x(),l.length>0&&alert(`${c} pesanan berhasil dibuat.
${l.length} gagal:
${l.join(`
`)}`);const d=document.querySelector('[data-target="aktif"]');d==null||d.click()}});window.submitPayment=function(){alert("Konfirmasi pembayaran berhasil dikirim!")};window.requestVendorStatus=async function(){if(!(!v||T))try{if(!confirm("Apakah Anda yakin ingin mendaftar sebagai Vendor?"))return;await m.collection("users").update(v.id,{vendor:"pending"}),alert("Permintaan berhasil dikirim! Menunggu persetujuan Admin."),window.location.reload()}catch(t){console.error("Gagal mengirim permintaan:",t),alert("Terjadi kesalahan saat mendaftar vendor.")}};const W="https://db.zizazu.my.id";let E=[],j="all",D;const X="tp_midtrans_accessed";function Y(){try{const t=localStorage.getItem(X);return new Set(t?JSON.parse(t):[])}catch{return new Set}}function Q(t){const e=Y();t.forEach(a=>e.add(a));try{localStorage.setItem(X,JSON.stringify([...e]))}catch{}}const gt={CGK:"Jakarta (CGK)",JED:"Jeddah (JED)",MED:"Madinah (MED)",SUB:"Surabaya (SUB)",DPS:"Bali (DPS)"},P={paid:"Lunas",pending:"Menunggu pembayaran",failed:"Kedaluwarsa"};function z(t){return gt[t]||t}function u(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function mt(t){return t?t.length===6?`${u(z(t.slice(0,3)))} &rarr; ${u(z(t.slice(3,6)))}`:u(t):""}function Z(t){const e=Number(t);return!e||isNaN(e)?null:new Date(Math.round((e-25569)*86400*1e3))}function q(t){const e=Z(t);return e?e.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"}):u(t)}function y(t){return"Rp "+(Number(t)||0).toLocaleString("id-ID")}function h(t,e){const a=document.getElementById(t);a&&(a.textContent=e)}function I(t){var a,n;if(typeof t.gross_amount=="number")return t.gross_amount;if(typeof t.amount=="number")return t.amount;if(typeof t.total=="number")return t.total;const e=((a=t.expand)==null?void 0:a.flight)??((n=t.expand)==null?void 0:n.flightId);return e?((Number(e.jual)||0)+(Number(e.markup)||0))*1e3:0}function C(t){const e=String(t.status??"").toLowerCase();return["paid","settlement","capture","success","lunas"].includes(e)?"paid":["expire","expired","cancel","deny","failure","failed"].includes(e)?"failed":"pending"}function ft(t){var a,n;const e=((a=t.expand)==null?void 0:a.flight)??((n=t.expand)==null?void 0:n.flightId);return e!=null&&e.dot?Z(e.dot):t.departure?new Date(t.departure):null}async function k(){var e,a;const t=document.querySelector("#aktif .bk-list");if(t){if(!m.authStore.isValid){t.innerHTML=`
            <div class="bk-empty">
                <h3>Belum masuk</h3>
                <p>Masuk dulu untuk melihat pesanan tiket Anda.</p>
                <button onclick="window.location.href='/login.html'">Masuk</button>
            </div>`;return}try{const n=(e=m.authStore.model)==null?void 0:e.id,s=n?m.filter("user = {:userId}",{userId:n}):'id = ""';let i;try{i=await m.collection("bookings").getList(1,50,{sort:"-created",expand:"flight,flightId",filter:s})}catch{i=await m.collection("bookings").getList(1,50,{expand:"flight,flightId",filter:s})}E=i.items,tt(),kt(E)}catch(n){console.error("Gagal memuat pesanan:",n.status,n.response),t.innerHTML=`
            <div class="bk-empty">
                <h3>Gagal memuat pesanan</h3>
                <p>${u(((a=n.response)==null?void 0:a.message)||n.message||"Kesalahan tidak diketahui")}</p>
            </div>`}}}function kt(t){const e=t.filter(r=>C(r)!=="failed"),a=e.reduce((r,p)=>r+I(p),0),n=e.filter(r=>C(r)==="paid").reduce((r,p)=>r+I(p),0),s=a-n,i=e.filter(r=>C(r)==="pending"),o=a>0?Math.round(n/a*100):0,l=e.map(ft).filter(r=>r instanceof Date&&!isNaN(r.getTime())).map(r=>Math.ceil((r.getTime()-Date.now())/864e5)).filter(r=>r>=0).sort((r,p)=>r-p)[0];h("sum-total",y(a)),h("sum-paid",y(n)),h("sum-due",y(s)),h("sum-percent",`${o}% lunas`),h("sum-active",String(e.length)),h("sum-pending",String(i.length)),h("sum-next",l!==void 0?`${l} hari`:"—");const c=document.getElementById("sum-bar");c&&(c.style.width=`${o}%`);const d=document.getElementById("btnPayAll");if(d){if(i.length===0){d.disabled=!0,d.textContent=e.length?"Semua lunas":"Belum ada pesanan",d.onclick=null;return}d.disabled=!1,d.textContent="Bayar sepenuhnya",d.onclick=()=>vt(i,d)}}function tt(){const t=document.querySelector("#aktif .bk-list");if(!t)return;const e=j==="all"?E:E.filter(a=>C(a)===j);if(e.length===0){t.innerHTML=`
            <div class="bk-empty">
                <h3>Belum ada pesanan</h3>
                <p>Tiket yang Anda pesan akan muncul di sini.</p>
                <button onclick="document.querySelector('[data-target=pembelian]').click()">Cari tiket</button>
            </div>`;return}t.innerHTML=e.map(bt).join(""),ht()}function bt(t){var r,p;const e=((r=t.expand)==null?void 0:r.flight)||((p=t.expand)==null?void 0:p.flightId)||{},a=C(t),n=I(t),s=String(e.vendor||"Garuda"),i=`${u(e.prog)} &middot; ${u(e.day)}`,o=`
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

        <div class="bk-divider"></div>`,l=`
        <div class="bk-airline">
            <img src="/assets/Airlines/${encodeURIComponent(s)}.png" alt="${u(s)}"
                 onerror="this.onerror=null; this.src='/Airlines/Garuda.png'">
        </div>`;if(a==="paid")return`
        <div class="bk-card" data-id="${u(t.id)}">
            ${l}
            ${o}

            <div class="bk-booking">
                <div class="bk-booking-info">
                    <div class="bk-info-group">
                        <span class="bk-label">Kode pemesanan</span>
                        <span class="bk-value">${u(t.order_id)}</span>
                    </div>
                    <div class="bk-info-group">
                        <span class="bk-label">Total bayar</span>
                        <span class="bk-price">${y(n)}</span>
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
            ${l}
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
                        <span class="bk-price bk-price--void">${y(n)}</span>
                    </div>
                </div>
                <button class="bk-pay bk-pay--expired" disabled>Kedaluwarsa</button>
            </div>
        </div>`;const c=Y().has(t.id),d=c?'<span class="bk-label">Sisa waktu</span><span class="bk-countdown">--:--:--</span>':'<span class="bk-note">Selesaikan pembayaran<br>sesuai instruksi</span>';return`
    <div class="bk-card" data-id="${u(t.id)}">
        ${l}
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
            <div class="bk-pending-row bk-row-bottom" data-expiry="${c?u(t.expiry_time||""):""}">
                <div class="bk-info-group">
                    <span class="bk-label">Total tagihan</span>
                    <span class="bk-price">${y(n)}</span>
                </div>
                <div class="bk-info-group bk-text-right">
                    ${d}
                </div>
            </div>
            <button class="bk-pay" data-order="${u(t.order_id)}" data-booking-id="${u(t.id)}">Bayar sekarang</button>
        </div>
    </div>`}function ht(){D&&window.clearInterval(D),V(),D=window.setInterval(V,1e3)}function V(){document.querySelectorAll("#aktif .bk-row-bottom[data-expiry]").forEach(t=>{var d;const e=t.dataset.expiry,a=t.querySelector(".bk-countdown");if(!e||!a)return;const n=new Date(e.replace(" ","T")+"+07:00").getTime();if(isNaN(n)){a.textContent="--:--:--";return}const s=n-Date.now();if(s<=0){a.textContent="00:00:00",a.classList.add("bk-countdown--urgent");const r=(d=t.closest(".bk-booking"))==null?void 0:d.querySelector(".bk-pay");r&&!r.disabled&&(r.disabled=!0,r.textContent="Kedaluwarsa",r.classList.add("bk-pay--expired"));return}const i=Math.floor(s/36e5),o=Math.floor(s%36e5/6e4),l=Math.floor(s%6e4/1e3),c=r=>String(r).padStart(2,"0");a.textContent=`${c(i)}:${c(o)}:${c(l)}`,a.classList.toggle("bk-countdown--urgent",s<36e5)})}async function vt(t,e){if(!m.authStore.isValid){alert("Sesi Anda telah berakhir. Silakan login kembali."),window.location.href="/login.html";return}const a=t.length,n=t.reduce((s,i)=>s+I(i),0);if(confirm(`Bayar ${a} tagihan sekaligus senilai ${y(n)}?`)){e.disabled=!0,e.textContent="Memproses…";try{const s=await fetch(`${W}/api/midtrans/token-bulk`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:m.authStore.token},body:JSON.stringify({bookingIds:t.map(o=>o.id)})}),i=await s.json().catch(()=>({}));if(!s.ok)throw new Error(i.error||`Gagal (${s.status})`);if(!window.snap)throw new Error("Modul pembayaran belum termuat. Muat ulang halaman.");Q(t.map(o=>o.id)),await k(),window.snap.pay(i.token,{onSuccess:()=>k(),onPending:()=>k(),onError:()=>{alert("Pembayaran gagal. Silakan coba lagi."),k()},onClose:()=>k()})}catch(s){console.error("Gagal membuat token pembayaran gabungan:",s),alert(s instanceof Error?s.message:"Terjadi kesalahan saat memproses pembayaran."),yt(e)}}}function yt(t){t.disabled=!1,t.textContent="Bayar sepenuhnya"}document.addEventListener("click",async t=>{const e=t.target,a=e.closest(".bk-filter");if(a){document.querySelectorAll(".bk-filter").forEach(i=>i.classList.remove("active")),a.classList.add("active"),j=a.dataset.status||"all",tt();return}const n=e.closest(".bk-pay");if(n&&!n.disabled){n.disabled=!0,n.textContent="Memproses…";const i=n.dataset.bookingId||"",o=()=>{n.disabled=!1,n.textContent="Bayar sekarang"};try{const l=await fetch(`${W}/api/midtrans/token`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:m.authStore.token},body:JSON.stringify({orderId:n.dataset.order})}),c=await l.json().catch(()=>({}));if(!l.ok||!c.token)throw new Error(c.error||`Gagal memuat pembayaran (${l.status}).`);if(!window.snap)throw new Error("Modul pembayaran belum termuat. Muat ulang halaman.");i&&Q([i]),await k(),window.snap.pay(c.token,{onSuccess:()=>k(),onPending:()=>k(),onError:()=>k(),onClose:()=>k()})}catch(l){alert(l instanceof Error?l.message:"Terjadi kesalahan."),o()}return}const s=e.closest(".bk-leg-toggle");if(s){const i=s.closest(".bk-card"),o=s.querySelector("span");if(!i||!o)return;const l=s.dataset.leg==="pergi",c=l?"pulang":"pergi";s.dataset.leg=c,o.textContent=l?"penerbangan pulang":"penerbangan pergi",i.querySelectorAll(".bk-leg-field").forEach(d=>{const r=d;r.textContent=r.dataset[c]||""})}});const N=document.querySelector('[data-target="aktif"]');N==null||N.addEventListener("click",()=>{E.length===0&&k()},{once:!0});document.querySelector("#aktif.active-content")&&k();
