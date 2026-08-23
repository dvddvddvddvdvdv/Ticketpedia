import{p as g}from"./pocketbase-BLeLc1eM.js";const lt="https://db.zizazu.my.id",ct={CGK:"Jakarta (CGK)",JED:"Jeddah (Jeddah)",MED:"Medan (Medan)",SUB:"Surabaya (Surabaya)",JEDJED:"Jeddah (Jeddah)"};function z(t){return ct[t]||t}function U(t){const e=Number(t);return!e||isNaN(e)?String(t):new Date(Math.round((e-25569)*86400*1e3)).toLocaleDateString("id-ID",{day:"2-digit",month:"short"})}function f(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function N(t){return t?t.length===6?`${f(z(t.slice(0,3)))} &rarr; ${f(z(t.slice(3,6)))}`:f(t):""}function dt(t){return"Rp "+t.toLocaleString("id-ID")}let y=[],Q=new Map;async function Z(){try{const t=await g.collection("bookings").getFullList({filter:'status != "failed"',fields:"flight"}),e=new Map;t.forEach(a=>{const n=a.flight;n&&e.set(n,(e.get(n)||0)+1)}),Q=e}catch(t){console.error("Gagal memuat jumlah pesanan per penerbangan:",t)}}function ut(t){return Number(t.hk)||0}function tt(t){const e=ut(t);return e<=0?1/0:e-(Q.get(t.id)||0)}const m=new Map;function pt(){let t=0;return m.forEach(e=>t+=e.price),t}function E(){const t=document.querySelector("#cart-bar");if(t){if(m.size===0){t.innerHTML="",t.style.display="none";return}t.style.display="flex",t.innerHTML=`
        <div class="cart-info">
            <strong>${m.size}</strong> tiket dipilih &middot;
            <span class="cart-total">${dt(pt())}</span>
        </div>
        <div class="cart-actions">
            <button class="btn-cart-clear" type="button">Kosongkan</button>
            <button class="btn-cart-checkout" type="button">Pesan Tiket</button>
        </div>
    `}}const A=!g.authStore.isValid,$=g.authStore.model,I=g.authStore.isAdmin,R=$?$.vendor||"user":null,gt=R==="user"&&!I,mt=R==="pending"&&!I,ft=R==="approved"&&!I,x=document.querySelector("#navUsername"),T=document.querySelector("#navEmail");var Y;!A&&$?(x&&(x.textContent=$.username||"User"),T&&(T.textContent=$.email||"")):I?(x&&(x.textContent="Admin"),T&&(T.textContent=((Y=g.authStore.model)==null?void 0:Y.email)||"")):x&&(x.textContent="Guest");function kt(){const t=document.querySelector("#loginBtn"),e=document.querySelector("#applyVendorBtn"),a=document.querySelector("#pendingVendorStatus"),n=document.querySelector("#vendorDashboardBtn"),s=document.querySelector("#adminPanelBtn");e&&(e.style.display="none"),a&&(a.style.display="none"),n&&(n.style.display="none"),s&&(s.style.display="none"),t&&(t.style.display=A?"block":"none"),gt?e&&(e.style.display="block"):mt?a&&(a.style.display="block"):ft?n&&(n.style.display="block"):I&&s&&(s.style.display="block")}kt();bt();async function bt(){try{y=await g.collection("flights").getFullList(),await Z(),L(y),ht()}catch(t){console.error("Error fetching flights from PocketBase:",t)}}function L(t){const e=document.querySelector(".ticket-list");if(e){if(t.length===0){e.innerHTML=`
            <div style="text-align:center; padding:20px; color:#666;">
                Tidak ada penerbangan yang ditemukan.
            </div>`;return}e.innerHTML=t.map(a=>{var V;const n=Number(a.jual)||0,s=Number(a.markup)||0,i=(n+s)*1e3,l=i.toLocaleString("id-ID"),c=String(a.vendor||"Garuda"),d=`/Airlines/${encodeURIComponent(c)}.png`;`${a.rute1?N(a.rute1).replace(/&rarr;|&amp;/g," - "):""}`;const o=m.has(a.id),r=tt(a),p=r<=0,b=!p&&r!==1/0&&r<=5;let M=o?"Batalkan":"Pilih Tiket";return p&&!o&&(M="Tiket Habis"),`
        <div class="ticket-wrapper" data-flight-id="${f(a.id)}" data-price="${i}">
            <div class="ticket-card">
                <div class="airline-info">
                    <img src="${d}" alt="${f(c)}"
                         onerror="this.onerror=null; this.src='/Airlines/Garuda.png'">
                </div>

                <div class="flight-details">
                    <div class="flight-leg">
                        <div class="route">Pergi: ${N(a.rute1)}</div>
                        <div class="time-details">
                            <span><img src="/icon/calender-icon.png" alt=""> ${f(U(a.dot))}</span>
                            <span class="divider">|</span>
                            <span>${f(a.time1)}</span>
                            <span class="divider">|</span>
                            <span class="time-date"><img src="/icon/time-icon.png" alt=""> ${f(a.flight1)}</span>
                        </div>
                    </div>

                    <div class="flight-leg">
                        <div class="route">Pulang: ${N(a.rute2)}</div>
                        <div class="time-details">
                            <span><img src="/icon/plane-icon.png" alt=""> ${f(U(a.dot_turn))}</span>
                            <span class="divider">|</span>
                            <span>${f(a.time2)}</span>
                            <span class="divider">|</span>
                            <span class="time-date"><img src="/icon/time-icon.png" alt=""> ${f(a.flight2)}</span>
                        </div>
                    </div>
                </div>

                <div class="price-container">
                    <div class="duration">Durasi: ${f(a.prog)} (${f(a.day)})</div>
                    ${b?`<div class="duration" style="color:#D97706;font-weight:600;">Sisa ${r} kursi</div>`:""}
                    <div class="price">Rp ${l}</div>
                </div>

                <div class="action-container">
                    <button class="btn-pilih" type="button" ${p&&!o?"disabled":""}>${f(M)}</button>
                </div>
            </div>

            <!-- FORM PENUMPANG — mengisi data sebelum ditambahkan ke pesanan -->
            <div class="booking-form">
                <h3 class="booking-title">Detail Penumpang</h3>

                <div class="form-row">
                    <div class="input-group" style="flex-grow:1;">
                        <label>Nama Lengkap (Sesuai KTP/Paspor)</label>
                        <input type="text" class="booking-input" data-field="name"
                               placeholder="Masukkan nama lengkap" value="${f(((V=m.get(a.id))==null?void 0:V.passengerName)||"")}">
                    </div>
                </div>

                <div class="booking-footer">
                    <div class="total-price">
                        Harga per orang: <span>Rp ${l}</span>
                    </div>
                    <button class="btn-lanjut" type="button">${o?"Perbarui di Pesanan":"Tambah ke Pesanan"}</button>
                </div>
            </div>
        </div>`}).join(""),m.forEach((a,n)=>{const s=e.querySelector(`[data-flight-id="${n}"]`);s==null||s.classList.add("active-booking")})}}function ht(){const t=document.querySelector('input[placeholder*="Search"], .search-bar, input[type="text"]');t&&t.addEventListener("input",e=>{const a=e.target.value.toLowerCase().trim(),n=y.filter(s=>{const i=(s.rute1||"").toLowerCase(),l=(s.rute2||"").toLowerCase(),c=(s.vendor||"").toLowerCase(),d=(s.flight1||"").toLowerCase(),o=(s.flight2||"").toLowerCase();return i.includes(a)||l.includes(a)||c.includes(a)||d.includes(a)||o.includes(a)||a.includes("jakarta")&&(i.includes("cgk")||l.includes("cgk"))||a.includes("jeddah")&&(i.includes("jed")||l.includes("jed"))});L(n)})}const O=document.querySelectorAll(".tab-link"),yt=document.querySelectorAll(".tab-content");O.forEach(t=>{t.addEventListener("click",()=>{O.forEach(a=>a.classList.remove("active")),t.classList.add("active"),yt.forEach(a=>a.classList.remove("active-content"));const e=t.getAttribute("data-target");if(e){const a=document.getElementById(e);a&&a.classList.add("active-content")}})});document.addEventListener("click",async t=>{const e=t.target,a=e.closest(".btn-pilih");if(a){if(A){alert("Silakan login atau daftar terlebih dahulu untuk memesan tiket.");return}const i=a.closest(".ticket-wrapper"),l=i==null?void 0:i.dataset.flightId;if(l&&m.has(l)){m.delete(l),L(y),E();return}i==null||i.classList.toggle("active-booking"),a.innerText=i!=null&&i.classList.contains("active-booking")?"Batalkan":"Pilih Tiket";return}const n=e.closest(".btn-lanjut");if(n){const i=n.closest(".ticket-wrapper");if(!i)return;const l=i.dataset.flightId,c=Number(i.dataset.price)||0,d=i.querySelector('[data-field="name"]'),o=(d==null?void 0:d.value.trim())||"";if(!o){alert("Silakan masukkan Nama Lengkap penumpang terlebih dahulu!"),d==null||d.focus();return}const r=i.querySelector(".route");m.set(l,{flightId:l,routeLabel:(r==null?void 0:r.textContent)||"",passengerName:o,price:c}),L(y),E();return}if(e.closest(".btn-cart-clear")){if(m.size===0||!confirm("Kosongkan semua tiket yang dipilih?"))return;m.clear(),L(y),E();return}const s=e.closest(".btn-cart-checkout");if(s){if(!g.authStore.isValid){alert("Sesi Anda telah berakhir. Silakan login kembali."),window.location.href="/login.html";return}if(m.size===0)return;s.disabled=!0,s.textContent="Memproses…",await Z();const i=[];if(m.forEach((r,p)=>{const b=y.find(M=>M.id===p);b&&tt(b)<=0&&(i.push(r.routeLabel||p),m.delete(p))}),i.length>0&&(alert(`Maaf, tiket berikut sudah habis dan dihapus dari pesanan:
${i.join(`
`)}`),L(y),E(),m.size===0)){s.disabled=!1,s.textContent="Pesan Tiket";return}const l=Array.from(m.values()),c=[];let d=0;for(const r of l)try{const p=await fetch(`${lt}/api/midtrans/token`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:g.authStore.token},body:JSON.stringify({flightId:r.flightId,name:r.passengerName})}),b=await p.json().catch(()=>({}));if(!p.ok)throw new Error(b.error||`Gagal (${p.status})`);d++}catch(p){console.error("Gagal membuat pesanan:",r.flightId,p),c.push(r.routeLabel||r.flightId)}m.clear(),E(),c.length>0&&alert(`${d} pesanan berhasil dibuat.
${c.length} gagal:
${c.join(`
`)}`);const o=document.querySelector('[data-target="aktif"]');o==null||o.click()}});window.submitPayment=function(){alert("Konfirmasi pembayaran berhasil dikirim!")};window.requestVendorStatus=async function(){if(!(!$||A))try{if(!confirm("Apakah Anda yakin ingin mendaftar sebagai Vendor?"))return;await g.collection("users").update($.id,{vendor:"pending"}),alert("Permintaan berhasil dikirim! Menunggu persetujuan Admin."),window.location.reload()}catch(t){console.error("Gagal mengirim permintaan:",t),alert("Terjadi kesalahan saat mendaftar vendor.")}};const et="https://db.zizazu.my.id";let h=[],_="all",q;const at="tp_midtrans_accessed";function nt(){try{const t=localStorage.getItem(at);return new Set(t?JSON.parse(t):[])}catch{return new Set}}function it(t){const e=nt();t.forEach(a=>e.add(a));try{localStorage.setItem(at,JSON.stringify([...e]))}catch{}}const vt={CGK:"Jakarta (CGK)",JED:"Jeddah (JED)",MED:"Madinah (MED)",SUB:"Surabaya (SUB)",DPS:"Bali (DPS)"},P={paid:"Lunas",pending:"Menunggu pembayaran",failed:"Kedaluwarsa"};function F(t){return vt[t]||t}function u(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function wt(t){return t?t.length===6?`${u(F(t.slice(0,3)))} &rarr; ${u(F(t.slice(3,6)))}`:u(t):""}function st(t){const e=Number(t);return!e||isNaN(e)?null:new Date(Math.round((e-25569)*86400*1e3))}function j(t){const e=st(t);return e?e.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"}):u(t)}function S(t){return"Rp "+(Number(t)||0).toLocaleString("id-ID")}function w(t,e){const a=document.getElementById(t);a&&(a.textContent=e)}function B(t){var a,n;if(typeof t.gross_amount=="number")return t.gross_amount;if(typeof t.amount=="number")return t.amount;if(typeof t.total=="number")return t.total;const e=((a=t.expand)==null?void 0:a.flight)??((n=t.expand)==null?void 0:n.flightId);return e?((Number(e.jual)||0)+(Number(e.markup)||0))*1e3:0}function C(t){const e=String(t.status??"").toLowerCase();return["paid","settlement","capture","success","lunas"].includes(e)?"paid":["expire","expired","cancel","deny","failure","failed"].includes(e)?"failed":"pending"}function $t(t){var a,n;const e=((a=t.expand)==null?void 0:a.flight)??((n=t.expand)==null?void 0:n.flightId);return e!=null&&e.dot?st(e.dot):t.departure?new Date(t.departure):null}async function k(){var e,a;const t=document.querySelector("#aktif .bk-list");if(t){if(!g.authStore.isValid){t.innerHTML=`
            <div class="bk-empty">
                <h3>Belum masuk</h3>
                <p>Masuk dulu untuk melihat pesanan tiket Anda.</p>
                <button onclick="window.location.href='/login.html'">Masuk</button>
            </div>`;return}try{const n=(e=g.authStore.model)==null?void 0:e.id,s=n?g.filter("user = {:userId}",{userId:n}):'id = ""';let i;try{i=await g.collection("bookings").getList(1,50,{sort:"-created",expand:"flight,flightId",filter:s})}catch{i=await g.collection("bookings").getList(1,50,{expand:"flight,flightId",filter:s})}h=i.items,D(),K(h)}catch(n){console.error("Gagal memuat pesanan:",n.status,n.response),t.innerHTML=`
            <div class="bk-empty">
                <h3>Gagal memuat pesanan</h3>
                <p>${u(((a=n.response)==null?void 0:a.message)||n.message||"Kesalahan tidak diketahui")}</p>
            </div>`}}}function K(t){const e=t.filter(r=>C(r)!=="failed"),a=e.reduce((r,p)=>r+B(p),0),n=e.filter(r=>C(r)==="paid").reduce((r,p)=>r+B(p),0),s=a-n,i=e.filter(r=>C(r)==="pending"),l=a>0?Math.round(n/a*100):0,c=e.map($t).filter(r=>r instanceof Date&&!isNaN(r.getTime())).map(r=>Math.ceil((r.getTime()-Date.now())/864e5)).filter(r=>r>=0).sort((r,p)=>r-p)[0];w("sum-total",S(a)),w("sum-paid",S(n)),w("sum-due",S(s)),w("sum-percent",`${l}% lunas`),w("sum-active",String(e.length)),w("sum-pending",String(i.length)),w("sum-next",c!==void 0?`${c} hari`:"—");const d=document.getElementById("sum-bar");d&&(d.style.width=`${l}%`);const o=document.getElementById("btnPayAll");if(o){if(i.length===0){o.disabled=!0,o.textContent=e.length?"Semua lunas":"Belum ada pesanan",o.onclick=null;return}o.disabled=!1,o.textContent="Bayar sepenuhnya",o.onclick=()=>Lt(i,o)}}function D(){const t=document.querySelector("#aktif .bk-list");if(!t)return;const e=_==="all"?h:h.filter(a=>C(a)===_);if(e.length===0){t.innerHTML=`
            <div class="bk-empty">
                <h3>Belum ada pesanan</h3>
                <p>Tiket yang Anda pesan akan muncul di sini.</p>
                <button onclick="document.querySelector('[data-target=pembelian]').click()">Cari tiket</button>
            </div>`;return}t.innerHTML=e.map(St).join(""),xt()}function St(t){var r,p;const e=((r=t.expand)==null?void 0:r.flight)||((p=t.expand)==null?void 0:p.flightId)||{},a=C(t),n=B(t),s=String(e.vendor||"Garuda"),i=`${u(e.prog)} &middot; ${u(e.day)}`,l=`
        <div class="bk-details">
            <p class="bk-route">${wt(e.rute1)}</p>
            <div class="bk-meta-list">
                <div class="bk-meta">
                    <img src="/icon/calender-icon.png" alt="">
                    <span class="bk-leg-field" data-pergi="${j(e.dot)}" data-pulang="${j(e.dot_turn)}">${j(e.dot)}</span>
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
            <img src="/assets/Airlines/${encodeURIComponent(s)}.png" alt="${u(s)}"
                 onerror="this.onerror=null; this.src='/Airlines/Garuda.png'">
        </div>`;if(a==="paid")return`
        <div class="bk-card" data-id="${u(t.id)}">
            ${c}
            ${l}

            <div class="bk-booking">
                <div class="bk-booking-info">
                    <div class="bk-info-group">
                        <span class="bk-label">Kode pemesanan</span>
                        <span class="bk-value">${u(t.order_id)}</span>
                    </div>
                    <div class="bk-info-group">
                        <span class="bk-label">Total bayar</span>
                        <span class="bk-price">${S(n)}</span>
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
        </div>`;if(a==="failed"){const b=u(e.id||"");return`
        <div class="bk-card bk-card--expired" data-id="${u(t.id)}">
            ${c}
            ${l}

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
                        <span class="bk-price bk-price--void">${S(n)}</span>
                    </div>
                </div>
                <div class="bk-expired-actions">
                    <button class="bk-rebook" type="button" data-flight-id="${b}">Pesan Lagi</button>
                    <button class="bk-delete" type="button" data-booking-id="${u(t.id)}">Hapus</button>
                </div>
            </div>
        </div>`}const d=nt().has(t.id),o=d?'<span class="bk-label">Sisa waktu</span><span class="bk-countdown">--:--:--</span>':'<span class="bk-note">Selesaikan pembayaran<br>sesuai instruksi</span>';return`
    <div class="bk-card" data-id="${u(t.id)}">
        ${c}
        ${l}

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
            <div class="bk-pending-row bk-row-bottom" data-expiry="${d?u(t.expiry_time||""):""}">
                <div class="bk-info-group">
                    <span class="bk-label">Total tagihan</span>
                    <span class="bk-price">${S(n)}</span>
                </div>
                <div class="bk-info-group bk-text-right">
                    ${o}
                </div>
            </div>
            <button class="bk-pay" data-order="${u(t.order_id)}" data-booking-id="${u(t.id)}">Bayar sekarang</button>
        </div>
    </div>`}function xt(){q&&window.clearInterval(q),W(),q=window.setInterval(W,1e3)}function W(){const t=[];document.querySelectorAll("#aktif .bk-row-bottom[data-expiry]").forEach(e=>{var r;const a=e.dataset.expiry,n=e.querySelector(".bk-countdown");if(!a||!n)return;const s=new Date(a.replace(" ","T")+"+07:00").getTime();if(isNaN(s)){n.textContent="--:--:--";return}const i=s-Date.now();if(i<=0){const p=(r=e.closest(".bk-card"))==null?void 0:r.dataset.id;p&&t.push(p);return}const l=Math.floor(i/36e5),c=Math.floor(i%36e5/6e4),d=Math.floor(i%6e4/1e3),o=p=>String(p).padStart(2,"0");n.textContent=`${o(l)}:${o(c)}:${o(d)}`,n.classList.toggle("bk-countdown--urgent",i<36e5)}),t.length>0&&(t.forEach(e=>{const a=h.find(n=>n.id===e);a&&(a.status="expired")}),setTimeout(()=>{D(),K(h)},0))}async function Lt(t,e){if(!g.authStore.isValid){alert("Sesi Anda telah berakhir. Silakan login kembali."),window.location.href="/login.html";return}const a=t.length,n=t.reduce((s,i)=>s+B(i),0);if(confirm(`Bayar ${a} tagihan sekaligus senilai ${S(n)}?`)){e.disabled=!0,e.textContent="Memproses…";try{const s=await fetch(`${et}/api/midtrans/token-bulk`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:g.authStore.token},body:JSON.stringify({bookingIds:t.map(l=>l.id)})}),i=await s.json().catch(()=>({}));if(!s.ok)throw new Error(i.error||`Gagal (${s.status})`);if(!window.snap)throw new Error("Modul pembayaran belum termuat. Muat ulang halaman.");it(t.map(l=>l.id)),await k(),window.snap.pay(i.token,{onSuccess:()=>k(),onPending:()=>k(),onError:()=>{alert("Pembayaran gagal. Silakan coba lagi."),k()},onClose:()=>k()})}catch(s){console.error("Gagal membuat token pembayaran gabungan:",s),alert(s instanceof Error?s.message:"Terjadi kesalahan saat memproses pembayaran."),Et(e)}}}function Et(t){t.disabled=!1,t.textContent="Bayar sepenuhnya"}document.addEventListener("click",async t=>{const e=t.target,a=e.closest(".bk-filter");if(a){document.querySelectorAll(".bk-filter").forEach(c=>c.classList.remove("active")),a.classList.add("active"),_=a.dataset.status||"all",D();return}const n=e.closest(".bk-pay");if(n&&!n.disabled){n.disabled=!0,n.textContent="Memproses…";const c=n.dataset.bookingId||"",d=()=>{n.disabled=!1,n.textContent="Bayar sekarang"};try{const o=await fetch(`${et}/api/midtrans/token`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:g.authStore.token},body:JSON.stringify({orderId:n.dataset.order})}),r=await o.json().catch(()=>({}));if(!o.ok||!r.token)throw new Error(r.error||`Gagal memuat pembayaran (${o.status}).`);if(!window.snap)throw new Error("Modul pembayaran belum termuat. Muat ulang halaman.");c&&it([c]),await k(),window.snap.pay(r.token,{onSuccess:()=>k(),onPending:()=>k(),onError:()=>k(),onClose:()=>k()})}catch(o){alert(o instanceof Error?o.message:"Terjadi kesalahan."),d()}return}const s=e.closest(".bk-rebook");if(s){const c=s.dataset.flightId,d=document.querySelector('[data-target="pembelian"]');d==null||d.click(),c&&setTimeout(()=>{const o=document.querySelector(`.ticket-wrapper[data-flight-id="${c}"]`);o&&(o.scrollIntoView({behavior:"smooth",block:"center"}),o.classList.add("ticket-highlight"),setTimeout(()=>o.classList.remove("ticket-highlight"),1600))},150);return}const i=e.closest(".bk-delete");if(i){const c=i.dataset.bookingId;if(!c||!confirm("Hapus pesanan ini dari daftar? Tindakan ini tidak bisa dibatalkan."))return;i.disabled=!0,i.textContent="Menghapus…";try{await g.collection("bookings").delete(c),h=h.filter(d=>d.id!==c),D(),K(h)}catch(d){console.error("Gagal menghapus pesanan:",d),alert("Gagal menghapus pesanan. Silakan coba lagi."),i.disabled=!1,i.textContent="Hapus"}return}const l=e.closest(".bk-leg-toggle");if(l){const c=l.closest(".bk-card"),d=l.querySelector("span");if(!c||!d)return;const o=l.dataset.leg==="pergi",r=o?"pulang":"pergi";l.dataset.leg=r,d.textContent=o?"penerbangan pulang":"penerbangan pergi",c.querySelectorAll(".bk-leg-field").forEach(p=>{const b=p;b.textContent=b.dataset[r]||""})}});const G=document.querySelector('[data-target="aktif"]');G==null||G.addEventListener("click",()=>{h.length===0&&k()},{once:!0});document.querySelector("#aktif.active-content")&&k();const Ct={CGK:"Jakarta (CGK)",JED:"Jeddah (JED)",MED:"Madinah (MED)",SUB:"Surabaya (SUB)",DPS:"Bali (DPS)"},It={paid:"Lunas",pending:"Menunggu pembayaran",failed:"Kedaluwarsa"};let J=[],rt=!1;function X(t){return Ct[t]||t}function v(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Mt(t){return t?t.length===6?`${v(X(t.slice(0,3)))} &rarr; ${v(X(t.slice(3,6)))}`:v(t):""}function Tt(t){const e=Number(t);return!e||isNaN(e)?null:new Date(Math.round((e-25569)*86400*1e3))}function Bt(t){const e=Tt(t);return e?e.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"}):v(t)}function Dt(t){const e=new Date(String(t).replace(" ","T"));return isNaN(e.getTime())?"":e.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"})}function At(t){return"Rp "+(Number(t)||0).toLocaleString("id-ID")}function Nt(t){var a,n;if(typeof t.gross_amount=="number")return t.gross_amount;if(typeof t.amount=="number")return t.amount;if(typeof t.total=="number")return t.total;const e=((a=t.expand)==null?void 0:a.flight)??((n=t.expand)==null?void 0:n.flightId);return e?((Number(e.jual)||0)+(Number(e.markup)||0))*1e3:0}function qt(t){const e=String(t.status??"").toLowerCase();return["paid","settlement","capture","success","lunas"].includes(e)?"paid":["expire","expired","cancel","deny","failure","failed"].includes(e)?"failed":"pending"}async function ot(){var e,a;const t=document.querySelector("#riwayat-list");if(t){if(!g.authStore.isValid){t.innerHTML=`
            <div class="riwayat-empty">
                <h3>Belum masuk</h3>
                <p>Masuk dulu untuk melihat riwayat pemesanan Anda.</p>
                <button onclick="window.location.href='/login.html'">Masuk</button>
            </div>`;return}t.innerHTML='<div class="riwayat-loading">Memuat riwayat…</div>';try{const n=(e=g.authStore.model)==null?void 0:e.id,s=n?g.filter("user = {:userId}",{userId:n}):'id = ""';let i;try{i=await g.collection("bookings").getList(1,100,{sort:"-created",expand:"flight,flightId",filter:s})}catch{i=await g.collection("bookings").getList(1,100,{expand:"flight,flightId",filter:s})}J=i.items,rt=!0,Pt()}catch(n){console.error("Gagal memuat riwayat pemesanan:",n.status,n.response),t.innerHTML=`
            <div class="riwayat-empty">
                <h3>Gagal memuat riwayat</h3>
                <p>${v(((a=n.response)==null?void 0:a.message)||n.message||"Kesalahan tidak diketahui")}</p>
            </div>`}}}function Pt(){const t=document.querySelector("#riwayat-list");if(t){if(J.length===0){t.innerHTML=`
            <div class="riwayat-empty">
                <h3>Belum ada riwayat</h3>
                <p>Pesanan yang pernah Anda buat akan muncul di sini.</p>
                <button onclick="document.querySelector('[data-target=pembelian]').click()">Cari tiket</button>
            </div>`;return}t.innerHTML=J.map(jt).join("")}}function jt(t){var i,l;const e=((i=t.expand)==null?void 0:i.flight)||((l=t.expand)==null?void 0:l.flightId)||{},a=qt(t),n=Nt(t),s=String(e.vendor||"Garuda");return`
    <div class="riwayat-row">
        <div class="riwayat-airline">
            <img src="/assets/Airlines/${encodeURIComponent(s)}.png" alt="${v(s)}"
                 onerror="this.onerror=null; this.src='/Airlines/Garuda.png'">
        </div>

        <div class="riwayat-main">
            <span class="riwayat-route">${Mt(e.rute1)||"—"}</span>
            <span class="riwayat-meta">${Dt(t.created)||Bt(e.dot)} &middot; ${v(t.order_id)}</span>
        </div>

        <div class="riwayat-amount">${At(n)}</div>

        <span class="riwayat-status riwayat-status--${a}">${v(It[a])}</span>
    </div>`}const H=document.querySelector('[data-target="riwayat"]');H==null||H.addEventListener("click",()=>{rt||ot()});document.querySelector("#riwayat.active-content")&&ot();
