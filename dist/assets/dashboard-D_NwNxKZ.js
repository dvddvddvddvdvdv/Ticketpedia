import{p as g}from"./pocketbase-BLeLc1eM.js";const it="https://db.zizazu.my.id",st={CGK:"Jakarta (CGK)",JED:"Jeddah (Jeddah)",MED:"Medan (Medan)",SUB:"Surabaya (Surabaya)",JEDJED:"Jeddah (Jeddah)"};function V(t){return st[t]||t}function z(t){const e=Number(t);return!e||isNaN(e)?String(t):new Date(Math.round((e-25569)*86400*1e3)).toLocaleDateString("id-ID",{day:"2-digit",month:"short",timeZone:"UTC"})}function f(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function A(t){return t?t.length===6?`${f(V(t.slice(0,3)))} &rarr; ${f(V(t.slice(3,6)))}`:f(t):""}function rt(t){return"Rp "+t.toLocaleString("id-ID")}let w=[],ot=new Map;async function Q(){try{const t=await g.collection("bookings").getFullList({filter:'status != "failed"',fields:"flight"}),e=new Map;t.forEach(a=>{const n=a.flight;n&&e.set(n,(e.get(n)||0)+1)}),ot=e}catch(t){console.error("Gagal memuat jumlah pesanan per penerbangan:",t)}}function Y(t){return 1/0}const m=new Map;function lt(t){let e=0;for(const a of m.values())a.flightId===t&&e++;return e}function ct(){let t=0;return m.forEach(e=>t+=e.price),t}function E(){const t=document.querySelector("#cart-bar");if(t){if(m.size===0){t.innerHTML="",t.style.display="none";return}t.style.display="flex",t.innerHTML=`
        <div class="cart-info">
            <strong>${m.size}</strong> tiket dipilih &middot;
            <span class="cart-total">${rt(ct())}</span>
        </div>
        <div class="cart-actions">
            <button class="btn-cart-clear" type="button">Kosongkan</button>
            <button class="btn-cart-checkout" type="button">Pesan Tiket</button>
        </div>
    `}}const B=!g.authStore.isValid,$=g.authStore.model,I=g.authStore.isAdmin,R=$?$.vendor||"user":null,dt=R==="user"&&!I,ut=R==="pending"&&!I,pt=R==="approved"&&!I,x=document.querySelector("#navUsername"),T=document.querySelector("#navEmail");var X;!B&&$?(x&&(x.textContent=$.username||"User"),T&&(T.textContent=$.email||"")):I?(x&&(x.textContent="Admin"),T&&(T.textContent=((X=g.authStore.model)==null?void 0:X.email)||"")):x&&(x.textContent="Guest");function gt(){const t=document.querySelector("#loginBtn"),e=document.querySelector("#applyVendorBtn"),a=document.querySelector("#pendingVendorStatus"),n=document.querySelector("#vendorDashboardBtn"),s=document.querySelector("#adminPanelBtn");e&&(e.style.display="none"),a&&(a.style.display="none"),n&&(n.style.display="none"),s&&(s.style.display="none"),t&&(t.style.display=B?"block":"none"),dt?e&&(e.style.display="block"):ut?a&&(a.style.display="block"):pt?n&&(n.style.display="block"):I&&s&&(s.style.display="block")}gt();ft();async function ft(){try{w=await g.collection("flights").getFullList(),await Q(),L(w),mt()}catch(t){console.error("Error fetching flights from PocketBase:",t)}}function L(t){const e=document.querySelector(".ticket-list");if(e){if(t.length===0){e.innerHTML=`
            <div style="text-align:center; padding:20px; color:#666;">
                Tidak ada penerbangan yang ditemukan.
            </div>`;return}e.innerHTML=t.map(a=>{const n=Number(a.jual)||0,s=Number(a.markup)||0,i=(n+s)*1e3,d=i.toLocaleString("id-ID"),c=String(a.vendor||"Garuda"),l=`/Airlines/${encodeURIComponent(c)}.png`;`${a.rute1?A(a.rute1).replace(/&rarr;|&amp;/g," - "):""}`;const o=lt(a.id),r=o>0,u=Y(),b=u<=0,q=!b&&u!==1/0&&u<=5;let U=r?`Tambah lagi (${o})`:"Pilih Tiket";return b&&!r&&(U="Tiket Habis"),`
        <div class="ticket-wrapper" data-flight-id="${f(a.id)}" data-price="${i}">
            <div class="ticket-card">
                <div class="airline-info">
                    <img src="${l}" alt="${f(c)}"
                         onerror="this.onerror=null; this.src='/Airlines/Garuda.png'">
                </div>

                <div class="flight-details">
                    <div class="flight-leg">
                        <div class="route">Pergi: ${A(a.rute1)}</div>
                        <div class="time-details">
                            <span><img src="/icon/calender-icon.png" alt=""> ${f(z(a.dot))}</span>
                            <span class="divider">|</span>
                            <span>${f(a.time1)}</span>
                            <span class="divider">|</span>
                            <span class="time-date"><img src="/icon/time-icon.png" alt=""> ${f(a.flight1)}</span>
                        </div>
                    </div>

                    <div class="flight-leg">
                        <div class="route">Pulang: ${A(a.rute2)}</div>
                        <div class="time-details">
                            <span><img src="/icon/plane-icon.png" alt=""> ${f(z(a.dot_turn))}</span>
                            <span class="divider">|</span>
                            <span>${f(a.time2)}</span>
                            <span class="divider">|</span>
                            <span class="time-date"><img src="/icon/time-icon.png" alt=""> ${f(a.flight2)}</span>
                        </div>
                    </div>
                </div>

                <div class="price-container">
                    <div class="duration">Durasi: ${f(a.prog)} (${f(a.day)})</div>
                    ${q?`<div class="duration" style="color:#D97706;font-weight:600;">Sisa ${u} kursi</div>`:""}
                    <div class="price">Rp ${d}</div>
                </div>

                <div class="action-container">
                    <button class="btn-pilih" type="button" ${b&&!r?"disabled":""}>${f(U)}</button>
                </div>
            </div>

            <!-- FORM PENUMPANG — mengisi data sebelum ditambahkan ke pesanan -->
            <div class="booking-form">
                <h3 class="booking-title">Detail Penumpang</h3>

                <div class="form-row">
                    <div class="input-group" style="flex-grow:1;">
                        <label>Nama Lengkap (Sesuai KTP/Paspor)</label>
                        <input type="text" class="booking-input" data-field="name"
                               placeholder="Masukkan nama lengkap" value="">
                    </div>
                </div>

                <div class="booking-footer">
                    <div class="total-price">
                        Harga per orang: <span>Rp ${d}</span>
                    </div>
                    <button class="btn-lanjut" type="button">Tambah ke Pesanan</button>
                </div>
            </div>
        </div>`}).join(""),m.forEach(a=>{const n=e.querySelector(`[data-flight-id="${a.flightId}"]`);n==null||n.classList.add("active-booking")})}}function mt(){const t=document.querySelector('input[placeholder*="Search"], .search-bar, input[type="text"]');t&&t.addEventListener("input",e=>{const a=e.target.value.toLowerCase().trim(),n=w.filter(s=>{const i=(s.rute1||"").toLowerCase(),d=(s.rute2||"").toLowerCase(),c=(s.vendor||"").toLowerCase(),l=(s.flight1||"").toLowerCase(),o=(s.flight2||"").toLowerCase();return i.includes(a)||d.includes(a)||c.includes(a)||l.includes(a)||o.includes(a)||a.includes("jakarta")&&(i.includes("cgk")||d.includes("cgk"))||a.includes("jeddah")&&(i.includes("jed")||d.includes("jed"))});L(n)})}const F=document.querySelectorAll(".tab-link"),kt=document.querySelectorAll(".tab-content");F.forEach(t=>{t.addEventListener("click",()=>{F.forEach(a=>a.classList.remove("active")),t.classList.add("active"),kt.forEach(a=>a.classList.remove("active-content"));const e=t.getAttribute("data-target");if(e){const a=document.getElementById(e);a&&a.classList.add("active-content")}})});document.addEventListener("click",async t=>{const e=t.target,a=e.closest(".btn-pilih");if(a){if(B){alert("Silakan login atau daftar terlebih dahulu untuk memesan tiket.");return}const i=a.closest(".ticket-wrapper");i==null||i.dataset.flightId,i==null||i.classList.toggle("active-booking"),a.innerText=i!=null&&i.classList.contains("active-booking")?"Batalkan":"Pilih Tiket";return}const n=e.closest(".btn-lanjut");if(n){const i=n.closest(".ticket-wrapper");if(!i)return;const d=i.dataset.flightId,c=Number(i.dataset.price)||0,l=i.querySelector('[data-field="name"]'),o=(l==null?void 0:l.value.trim())||"";if(!o){alert("Silakan masukkan Nama Lengkap penumpang terlebih dahulu!"),l==null||l.focus();return}const r=i.querySelector(".route"),u=d+"-"+Date.now()+"-"+Math.random().toString(36).slice(2,7);m.set(u,{itemId:u,flightId:d,routeLabel:(r==null?void 0:r.textContent)||"",passengerName:o,price:c}),L(w),E();return}if(e.closest(".btn-cart-clear")){if(m.size===0||!confirm("Kosongkan semua tiket yang dipilih?"))return;m.clear(),L(w),E();return}const s=e.closest(".btn-cart-checkout");if(s){if(!g.authStore.isValid){alert("Sesi Anda telah berakhir. Silakan login kembali."),window.location.href="/login.html";return}if(m.size===0)return;s.disabled=!0,s.textContent="Memproses…",await Q();const i=[];if(m.forEach((r,u)=>{w.find(q=>q.id===r.flightId)&&Y()<=0&&(i.push(r.routeLabel||r.flightId),m.delete(u))}),i.length>0&&(alert(`Maaf, tiket berikut sudah habis dan dihapus dari pesanan:
${i.join(`
`)}`),L(w),E(),m.size===0)){s.disabled=!1,s.textContent="Pesan Tiket";return}const d=Array.from(m.values()),c=[];let l=0;for(const r of d)try{const u=await fetch(`${it}/api/bookings/create`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:g.authStore.token},body:JSON.stringify({flightId:r.flightId,name:r.passengerName})}),b=await u.json().catch(()=>({}));if(!u.ok)throw new Error(b.error||`Gagal (${u.status})`);l++}catch(u){console.error("Gagal membuat pesanan:",r.flightId,u),c.push(r.routeLabel||r.flightId)}m.clear(),E(),c.length>0&&alert(`${l} pesanan berhasil dibuat.
${c.length} gagal:
${c.join(`
`)}`);const o=document.querySelector('[data-target="aktif"]');o==null||o.click()}});window.submitPayment=function(){alert("Konfirmasi pembayaran berhasil dikirim!")};window.requestVendorStatus=async function(){if(!(!$||B))try{if(!confirm("Apakah Anda yakin ingin mendaftar sebagai Vendor?"))return;await g.collection("users").update($.id,{vendor:"pending"}),alert("Permintaan berhasil dikirim! Menunggu persetujuan Admin."),window.location.reload()}catch(t){console.error("Gagal mengirim permintaan:",t),alert("Terjadi kesalahan saat mendaftar vendor.")}};const tt="https://db.zizazu.my.id";let h=[],J="all",N;const bt={CGK:"Jakarta (CGK)",JED:"Jeddah (JED)",MED:"Madinah (MED)",SUB:"Surabaya (SUB)",DPS:"Bali (DPS)"},P={paid:"Lunas",pending:"Menunggu pembayaran",failed:"Kedaluwarsa"};function O(t){return bt[t]||t}function p(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ht(t){return t?t.length===6?`${p(O(t.slice(0,3)))} &rarr; ${p(O(t.slice(3,6)))}`:p(t):""}function et(t){const e=Number(t);return!e||isNaN(e)?null:new Date(Math.round((e-25569)*86400*1e3))}function j(t){const e=et(t);return e?e.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric",timeZone:"UTC"}):p(t)}function S(t){return"Rp "+(Number(t)||0).toLocaleString("id-ID")}function v(t,e){const a=document.getElementById(t);a&&(a.textContent=e)}function M(t){var a,n;if(typeof t.gross_amount=="number")return t.gross_amount;if(typeof t.amount=="number")return t.amount;if(typeof t.total=="number")return t.total;const e=((a=t.expand)==null?void 0:a.flight)??((n=t.expand)==null?void 0:n.flightId);return e?((Number(e.jual)||0)+(Number(e.markup)||0))*1e3:0}function C(t){const e=String(t.status??"").toLowerCase();return["paid","settlement","capture","success","lunas"].includes(e)?"paid":["expire","expired","cancel","deny","failure","failed","falied"].includes(e)?"failed":"pending"}function yt(t){var a,n;const e=((a=t.expand)==null?void 0:a.flight)??((n=t.expand)==null?void 0:n.flightId);return e!=null&&e.dot?et(e.dot):t.departure?new Date(t.departure):null}async function k(){var e,a;const t=document.querySelector("#aktif .bk-list");if(t){if(!g.authStore.isValid){t.innerHTML=`
            <div class="bk-empty">
                <h3>Belum masuk</h3>
                <p>Masuk dulu untuk melihat pesanan tiket Anda.</p>
                <button onclick="window.location.href='/login.html'">Masuk</button>
            </div>`;return}try{const n=(e=g.authStore.model)==null?void 0:e.id,s=n?g.filter("user = {:userId}",{userId:n}):'id = ""';let i;try{i=await g.collection("bookings").getList(1,50,{sort:"-created",expand:"flight,flightId",filter:s})}catch{i=await g.collection("bookings").getList(1,50,{expand:"flight,flightId",filter:s})}h=i.items,D(),K(h)}catch(n){console.error("Gagal memuat pesanan:",n.status,n.response),t.innerHTML=`
            <div class="bk-empty">
                <h3>Gagal memuat pesanan</h3>
                <p>${p(((a=n.response)==null?void 0:a.message)||n.message||"Kesalahan tidak diketahui")}</p>
            </div>`}}}function K(t){const e=t.filter(r=>C(r)!=="failed"),a=e.reduce((r,u)=>r+M(u),0),n=e.filter(r=>C(r)==="paid").reduce((r,u)=>r+M(u),0),s=a-n,i=e.filter(r=>C(r)==="pending"),d=a>0?Math.round(n/a*100):0,c=e.map(yt).filter(r=>r instanceof Date&&!isNaN(r.getTime())).map(r=>Math.ceil((r.getTime()-Date.now())/864e5)).filter(r=>r>=0).sort((r,u)=>r-u)[0];v("sum-total",S(a)),v("sum-paid",S(n)),v("sum-due",S(s)),v("sum-percent",`${d}% lunas`),v("sum-active",String(e.length)),v("sum-pending",String(i.length)),v("sum-next",c!==void 0?`${c} hari`:"—");const l=document.getElementById("sum-bar");l&&(l.style.width=`${d}%`);const o=document.getElementById("btnPayAll");if(o){if(i.length===0){o.disabled=!0,o.textContent=e.length?"Semua lunas":"Belum ada pesanan",o.onclick=null;return}o.disabled=!1,o.textContent="Bayar sepenuhnya",o.onclick=()=>$t(i,o)}}function D(){const t=document.querySelector("#aktif .bk-list");if(!t)return;const e=J==="all"?h:h.filter(a=>C(a)===J);if(e.length===0){t.innerHTML=`
            <div class="bk-empty">
                <h3>Belum ada pesanan</h3>
                <p>Tiket yang Anda pesan akan muncul di sini.</p>
                <button onclick="document.querySelector('[data-target=pembelian]').click()">Cari tiket</button>
            </div>`;return}t.innerHTML=e.map(vt).join(""),wt()}function vt(t){var r,u;const e=((r=t.expand)==null?void 0:r.flight)||((u=t.expand)==null?void 0:u.flightId)||{},a=C(t),n=M(t),s=String(e.vendor||"Garuda"),i=`${p(e.prog)} &middot; ${p(e.day)}`,d=`
        <div class="bk-details">
            <p class="bk-route">${ht(e.rute1)}</p>
            <div class="bk-meta-list">
                <div class="bk-meta">
                    <img src="/icon/calender-icon.png" alt="">
                    <span class="bk-leg-field" data-pergi="${j(e.dot)}" data-pulang="${j(e.dot_turn)}">${j(e.dot)}</span>
                </div>
                <div class="bk-meta">
                    <img src="/icon/time-icon.png" alt="">
                    <span class="bk-leg-field" data-pergi="${p(e.time1)} WIB" data-pulang="${p(e.time2)} WIB">${p(e.time1)} WIB</span>
                </div>
                <div class="bk-meta">
                    <img src="/icon/plane-icon.png" alt="">
                    <span class="bk-leg-field" data-pergi="${p(e.flight1)}" data-pulang="${p(e.flight2)}">${p(e.flight1)}</span>
                </div>
                <div class="bk-meta">
                    <img src="/icon/name-icon.png" alt="">
                    <span>${p(t.passenger_name)}</span>
                </div>
            </div>
            <button class="bk-leg-toggle" type="button" data-leg="pergi">
                <img class="bk-leg-icon" src="/icon/plane-icon.png" alt="">
                <span>penerbangan pergi</span>
            </button>
        </div>
        <div class="bk-divider"></div>`,c=`
        <div class="bk-airline">
            <img src="/assets/Airlines/${encodeURIComponent(s)}.png" alt="${p(s)}"
                 onerror="this.onerror=null; this.src='/Airlines/Garuda.png'">
        </div>`;if(a==="paid")return`
        <div class="bk-card" data-id="${p(t.id)}">
            ${c}
            ${d}
            <div class="bk-booking">
                <div class="bk-booking-info">
                    <div class="bk-info-group">
                        <span class="bk-label">Kode pemesanan</span>
                        <span class="bk-value">${p(t.order_id)}</span>
                    </div>
                    <div class="bk-info-group">
                        <span class="bk-label">Total bayar</span>
                        <span class="bk-price">${S(n)}</span>
                    </div>
                    <div class="bk-info-group">
                        <span class="bk-trip">${i}</span>
                        <span class="bk-payment">${p(t.payment_type||"—")}</span>
                    </div>
                </div>
                <div class="bk-booking-actions">
                    <span class="bk-status bk-status--paid">${p(P.paid)}</span>
                    <div class="bk-qr">E-tiket sedang diproses</div>
                    <button class="bk-eticket-btn" disabled>Lihat e-tiket</button>
                </div>
            </div>
        </div>`;if(a==="failed"){const b=p(e.id||"");return`
        <div class="bk-card bk-card--expired" data-id="${p(t.id)}">
            ${c}
            ${d}
            <div class="bk-booking bk-booking-pending">
                <div class="bk-pending-row">
                    <div class="bk-info-group">
                        <span class="bk-label">Kode pemesanan</span>
                        <span class="bk-value">${p(t.order_id)}</span>
                    </div>
                    <div class="bk-info-group bk-text-right">
                        <span class="bk-status bk-status--failed">${p(P.failed)}</span>
                        <span class="bk-trip">${i}</span>
                    </div>
                </div>
                <div class="bk-pending-row bk-row-bottom">
                    <div class="bk-info-group">
                        <span class="bk-label">Tagihan dibatalkan</span>
                        <span class="bk-price bk-price--void">${S(n)}</span>
                    </div>
                </div>
                <div class="bk-expired-actions">
                    <button class="bk-rebook" type="button" data-flight-id="${b}">Pesan Lagi</button>
                    <button class="bk-delete" type="button" data-booking-id="${p(t.id)}">Hapus</button>
                </div>
            </div>
        </div>`}const o=!!t.expiry_time?'<span class="bk-label">Sisa waktu</span><span class="bk-countdown">--:--:--</span>':'<span class="bk-note">Selesaikan pembayaran<br>sesuai instruksi</span>';return`
    <div class="bk-card" data-id="${p(t.id)}">
        ${c}
        ${d}
        <div class="bk-booking bk-booking-pending">
            <div class="bk-pending-row">
                <div class="bk-info-group">
                    <span class="bk-label">Kode pemesanan</span>
                    <span class="bk-value">${p(t.order_id)}</span>
                </div>
                <div class="bk-info-group bk-text-right">
                    <span class="bk-status bk-status--pending">${p(P.pending)}</span>
                    <span class="bk-trip">${i}</span>
                </div>
            </div>
            <div class="bk-pending-row bk-row-bottom" data-expiry="${p(t.expiry_time||"")}">
                <div class="bk-info-group">
                    <span class="bk-label">Total tagihan</span>
                    <span class="bk-price">${S(n)}</span>
                </div>
                <div class="bk-info-group bk-text-right">
                    ${o}
                </div>
            </div>
            <button class="bk-pay" data-order="${p(t.order_id)}" data-booking-id="${p(t.id)}">Bayar sekarang</button>
        </div>
    </div>`}function wt(){N&&window.clearInterval(N),Z(),N=window.setInterval(Z,1e3)}function Z(){const t=[];document.querySelectorAll("#aktif .bk-row-bottom[data-expiry]").forEach(e=>{var r;const a=e.dataset.expiry,n=e.querySelector(".bk-countdown");if(!a||!n)return;const s=new Date(a.replace(" ","T")+"+07:00").getTime();if(isNaN(s)){n.textContent="--:--:--";return}const i=s-Date.now();if(i<=0){const u=(r=e.closest(".bk-card"))==null?void 0:r.dataset.id;u&&t.push(u);return}const d=Math.floor(i/36e5),c=Math.floor(i%36e5/6e4),l=Math.floor(i%6e4/1e3),o=u=>String(u).padStart(2,"0");n.textContent=`${o(d)}:${o(c)}:${o(l)}`,n.classList.toggle("bk-countdown--urgent",i<36e5)}),t.length>0&&(t.forEach(e=>{const a=h.find(n=>n.id===e);a&&(a.status="expired")}),setTimeout(()=>{D(),K(h)},0))}async function $t(t,e){if(!g.authStore.isValid){alert("Sesi Anda telah berakhir. Silakan login kembali."),window.location.href="/login.html";return}const a=t.length,n=t.reduce((s,i)=>s+M(i),0);if(confirm(`Bayar ${a} tagihan sekaligus senilai ${S(n)}?`)){e.disabled=!0,e.textContent="Memproses…";try{const s=await fetch(`${tt}/api/midtrans/token-bulk`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:g.authStore.token},body:JSON.stringify({bookingIds:t.map(d=>d.id)})}),i=await s.json().catch(()=>({}));if(!s.ok)throw new Error(i.error||`Gagal (${s.status})`);if(!window.snap)throw new Error("Modul pembayaran belum termuat. Muat ulang halaman.");await k(),window.snap.pay(i.token,{onSuccess:()=>k(),onPending:()=>k(),onError:()=>{alert("Pembayaran gagal. Silakan coba lagi."),k()},onClose:()=>k()})}catch(s){console.error("Gagal membuat token pembayaran gabungan:",s),alert(s instanceof Error?s.message:"Terjadi kesalahan saat memproses pembayaran."),St(e)}}}function St(t){t.disabled=!1,t.textContent="Bayar sepenuhnya"}document.addEventListener("click",async t=>{const e=t.target,a=e.closest(".bk-filter");if(a){document.querySelectorAll(".bk-filter").forEach(c=>c.classList.remove("active")),a.classList.add("active"),J=a.dataset.status||"all",D();return}const n=e.closest(".bk-pay");if(n&&!n.disabled){n.disabled=!0,n.textContent="Memproses…";const c=()=>{n.disabled=!1,n.textContent="Bayar sekarang"};try{const l=await fetch(`${tt}/api/midtrans/token`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:g.authStore.token},body:JSON.stringify({orderId:n.dataset.order})}),o=await l.json().catch(()=>({}));if(!l.ok||!o.token)throw new Error(o.error||`Gagal memuat pembayaran (${l.status}).`);if(!window.snap)throw new Error("Modul pembayaran belum termuat. Muat ulang halaman.");await k(),window.snap.pay(o.token,{onSuccess:()=>k(),onPending:()=>k(),onError:()=>k(),onClose:()=>k()})}catch(l){alert(l instanceof Error?l.message:"Terjadi kesalahan."),c()}return}const s=e.closest(".bk-rebook");if(s){const c=s.dataset.flightId,l=document.querySelector('[data-target="pembelian"]');l==null||l.click(),c&&setTimeout(()=>{const o=document.querySelector(`.ticket-wrapper[data-flight-id="${c}"]`);o&&(o.scrollIntoView({behavior:"smooth",block:"center"}),o.classList.add("ticket-highlight"),setTimeout(()=>o.classList.remove("ticket-highlight"),1600))},150);return}const i=e.closest(".bk-delete");if(i){const c=i.dataset.bookingId;if(!c||!confirm("Hapus pesanan ini dari daftar? Tindakan ini tidak bisa dibatalkan."))return;i.disabled=!0,i.textContent="Menghapus…";try{await g.collection("bookings").delete(c),h=h.filter(l=>l.id!==c),D(),K(h)}catch(l){console.error("Gagal menghapus pesanan:",l),alert("Gagal menghapus pesanan. Silakan coba lagi."),i.disabled=!1,i.textContent="Hapus"}return}const d=e.closest(".bk-leg-toggle");if(d){const c=d.closest(".bk-card"),l=d.querySelector("span");if(!c||!l)return;const o=d.dataset.leg==="pergi",r=o?"pulang":"pergi";d.dataset.leg=r,l.textContent=o?"penerbangan pulang":"penerbangan pergi",c.querySelectorAll(".bk-leg-field").forEach(u=>{const b=u;b.textContent=b.dataset[r]||""})}});const G=document.querySelector('[data-target="aktif"]');G==null||G.addEventListener("click",()=>{h.length===0&&k()},{once:!0});document.querySelector("#aktif.active-content")&&k();const xt={CGK:"Jakarta (CGK)",JED:"Jeddah (JED)",MED:"Madinah (MED)",SUB:"Surabaya (SUB)",DPS:"Bali (DPS)"},Lt={paid:"Lunas",pending:"Menunggu pembayaran",failed:"Kedaluwarsa"};let _=[],at=!1;function W(t){return xt[t]||t}function y(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Ct(t){return t?t.length===6?`${y(W(t.slice(0,3)))} &rarr; ${y(W(t.slice(3,6)))}`:y(t):""}function It(t){const e=Number(t);return!e||isNaN(e)?null:new Date(Math.round((e-25569)*86400*1e3))}function Et(t){const e=It(t);return e?e.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric",timeZone:"UTC"}):y(t)}function Tt(t){const e=new Date(String(t).replace(" ","T"));return isNaN(e.getTime())?"":e.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric",timeZone:"Asia/Jakarta"})}function Mt(t){return"Rp "+(Number(t)||0).toLocaleString("id-ID")}function Dt(t){var a,n;if(typeof t.gross_amount=="number")return t.gross_amount;if(typeof t.amount=="number")return t.amount;if(typeof t.total=="number")return t.total;const e=((a=t.expand)==null?void 0:a.flight)??((n=t.expand)==null?void 0:n.flightId);return e?((Number(e.jual)||0)+(Number(e.markup)||0))*1e3:0}function Bt(t){const e=String(t.status??"").toLowerCase();return["paid","settlement","capture","success","lunas"].includes(e)?"paid":["expire","expired","cancel","deny","failure","failed"].includes(e)?"failed":"pending"}async function nt(){var e,a;const t=document.querySelector("#riwayat-list");if(t){if(!g.authStore.isValid){t.innerHTML=`
            <div class="riwayat-empty">
                <h3>Belum masuk</h3>
                <p>Masuk dulu untuk melihat riwayat pemesanan Anda.</p>
                <button onclick="window.location.href='/login.html'">Masuk</button>
            </div>`;return}t.innerHTML='<div class="riwayat-loading">Memuat riwayat…</div>';try{const n=(e=g.authStore.model)==null?void 0:e.id,s=n?g.filter("user = {:userId}",{userId:n}):'id = ""';let i;try{i=await g.collection("bookings").getList(1,100,{sort:"-created",expand:"flight,flightId",filter:s})}catch{i=await g.collection("bookings").getList(1,100,{expand:"flight,flightId",filter:s})}_=i.items,at=!0,qt()}catch(n){console.error("Gagal memuat riwayat pemesanan:",n.status,n.response),t.innerHTML=`
            <div class="riwayat-empty">
                <h3>Gagal memuat riwayat</h3>
                <p>${y(((a=n.response)==null?void 0:a.message)||n.message||"Kesalahan tidak diketahui")}</p>
            </div>`}}}function qt(){const t=document.querySelector("#riwayat-list");if(t){if(_.length===0){t.innerHTML=`
            <div class="riwayat-empty">
                <h3>Belum ada riwayat</h3>
                <p>Pesanan yang pernah Anda buat akan muncul di sini.</p>
                <button onclick="document.querySelector('[data-target=pembelian]').click()">Cari tiket</button>
            </div>`;return}t.innerHTML=_.map(At).join("")}}function At(t){var i,d;const e=((i=t.expand)==null?void 0:i.flight)||((d=t.expand)==null?void 0:d.flightId)||{},a=Bt(t),n=Dt(t),s=String(e.vendor||"Garuda");return`
    <div class="riwayat-row">
        <div class="riwayat-airline">
            <img src="/assets/Airlines/${encodeURIComponent(s)}.png" alt="${y(s)}"
                 onerror="this.onerror=null; this.src='/Airlines/Garuda.png'">
        </div>

        <div class="riwayat-main">
            <span class="riwayat-route">${Ct(e.rute1)||"—"}</span>
            <span class="riwayat-meta">${Tt(t.created)||Et(e.dot)} &middot; ${y(t.order_id)}</span>
        </div>

        <div class="riwayat-amount">${Mt(n)}</div>

        <span class="riwayat-status riwayat-status--${a}">${y(Lt[a])}</span>
    </div>`}const H=document.querySelector('[data-target="riwayat"]');H==null||H.addEventListener("click",()=>{at||nt()});document.querySelector("#riwayat.active-content")&&nt();
