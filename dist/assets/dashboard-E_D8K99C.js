import{p as g}from"./pocketbase-BLeLc1eM.js";const lt="https://db.zizazu.my.id",ct={CGK:"Jakarta (CGK)",JED:"Jeddah (Jeddah)",MED:"Medan (Medan)",SUB:"Surabaya (Surabaya)",JEDJED:"Jeddah (Jeddah)"};function z(t){return ct[t]||t}function U(t){const e=Number(t);return!e||isNaN(e)?String(t):new Date(Math.round((e-25569)*86400*1e3)).toLocaleDateString("id-ID",{day:"2-digit",month:"short"})}function f(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function A(t){return t?t.length===6?`${f(z(t.slice(0,3)))} &rarr; ${f(z(t.slice(3,6)))}`:f(t):""}function dt(t){return"Rp "+t.toLocaleString("id-ID")}let b=[],Y=new Map;async function Q(){try{const t=await g.collection("bookings").getFullList({filter:'status != "failed"',fields:"flight"}),e=new Map;t.forEach(a=>{const n=a.flight;n&&e.set(n,(e.get(n)||0)+1)}),Y=e}catch(t){console.error("Gagal memuat jumlah pesanan per penerbangan:",t)}}function ut(t){return Number(t.hk)||0}function Z(t){const e=ut(t);return e<=0?1/0:e-(Y.get(t.id)||0)}const m=new Map;function pt(){let t=0;return m.forEach(e=>t+=e.price),t}function E(){const t=document.querySelector("#cart-bar");if(t){if(m.size===0){t.innerHTML="",t.style.display="none";return}t.style.display="flex",t.innerHTML=`
        <div class="cart-info">
            <strong>${m.size}</strong> tiket dipilih &middot;
            <span class="cart-total">${dt(pt())}</span>
        </div>
        <div class="cart-actions">
            <button class="btn-cart-clear" type="button">Kosongkan</button>
            <button class="btn-cart-checkout" type="button">Pesan Tiket</button>
        </div>
    `}}const B=!g.authStore.isValid,v=g.authStore.model,M=g.authStore.isAdmin,J=v?v.vendor||"user":null,gt=J==="user"&&!M,mt=J==="pending"&&!M,ft=J==="approved"&&!M,x=document.querySelector("#navUsername"),T=document.querySelector("#navEmail");var X;!B&&v?(x&&(x.textContent=v.username||"User"),T&&(T.textContent=v.email||"")):M?(x&&(x.textContent="Admin"),T&&(T.textContent=((X=g.authStore.model)==null?void 0:X.email)||"")):x&&(x.textContent="Guest");function kt(){const t=document.querySelector("#loginBtn"),e=document.querySelector("#applyVendorBtn"),a=document.querySelector("#pendingVendorStatus"),n=document.querySelector("#vendorDashboardBtn"),s=document.querySelector("#adminPanelBtn");e&&(e.style.display="none"),a&&(a.style.display="none"),n&&(n.style.display="none"),s&&(s.style.display="none"),t&&(t.style.display=B?"block":"none"),gt?e&&(e.style.display="block"):mt?a&&(a.style.display="block"):ft?n&&(n.style.display="block"):M&&s&&(s.style.display="block")}kt();bt();async function bt(){try{b=await g.collection("flights").getFullList(),await Q(),L(b),ht()}catch(t){console.error("Error fetching flights from PocketBase:",t)}}function L(t){const e=document.querySelector(".ticket-list");if(e){if(t.length===0){e.innerHTML=`
            <div style="text-align:center; padding:20px; color:#666;">
                Tidak ada penerbangan yang ditemukan.
            </div>`;return}e.innerHTML=t.map(a=>{var R;const n=Number(a.jual)||0,s=Number(a.markup)||0,i=(n+s)*1e3,o=i.toLocaleString("id-ID"),l=String(a.vendor||"Garuda"),d=`/Airlines/${encodeURIComponent(l)}.png`;`${a.rute1?A(a.rute1).replace(/&rarr;|&amp;/g," - "):""}`;const c=m.has(a.id),r=Z(a),p=r<=0,S=!p&&r!==1/0&&r<=5;let D=c?"Batalkan":"Pilih Tiket";return p&&!c&&(D="Tiket Habis"),`
        <div class="ticket-wrapper" data-flight-id="${f(a.id)}" data-price="${i}">
            <div class="ticket-card">
                <div class="airline-info">
                    <img src="${d}" alt="${f(l)}"
                         onerror="this.onerror=null; this.src='/Airlines/Garuda.png'">
                </div>

                <div class="flight-details">
                    <div class="flight-leg">
                        <div class="route">Pergi: ${A(a.rute1)}</div>
                        <div class="time-details">
                            <span><img src="/icon/calender-icon.png" alt=""> ${f(U(a.dot))}</span>
                            <span class="divider">|</span>
                            <span>${f(a.time1)}</span>
                            <span class="divider">|</span>
                            <span class="time-date"><img src="/icon/time-icon.png" alt=""> ${f(a.flight1)}</span>
                        </div>
                    </div>

                    <div class="flight-leg">
                        <div class="route">Pulang: ${A(a.rute2)}</div>
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
                    ${S?`<div class="duration" style="color:#D97706;font-weight:600;">Sisa ${r} kursi</div>`:""}
                    <div class="price">Rp ${o}</div>
                </div>

                <div class="action-container">
                    <button class="btn-pilih" type="button" ${p&&!c?"disabled":""}>${f(D)}</button>
                </div>
            </div>

            <!-- FORM PENUMPANG — mengisi data sebelum ditambahkan ke pesanan -->
            <div class="booking-form">
                <h3 class="booking-title">Detail Penumpang</h3>

                <div class="form-row">
                    <div class="input-group" style="flex-grow:1;">
                        <label>Nama Lengkap (Sesuai KTP/Paspor)</label>
                        <input type="text" class="booking-input" data-field="name"
                               placeholder="Masukkan nama lengkap" value="${f(((R=m.get(a.id))==null?void 0:R.passengerName)||"")}">
                    </div>
                </div>

                <div class="booking-footer">
                    <div class="total-price">
                        Harga per orang: <span>Rp ${o}</span>
                    </div>
                    <button class="btn-lanjut" type="button">${c?"Perbarui di Pesanan":"Tambah ke Pesanan"}</button>
                </div>
            </div>
        </div>`}).join(""),m.forEach((a,n)=>{const s=e.querySelector(`[data-flight-id="${n}"]`);s==null||s.classList.add("active-booking")})}}function ht(){const t=document.querySelector('input[placeholder*="Search"], .search-bar, input[type="text"]');t&&t.addEventListener("input",e=>{const a=e.target.value.toLowerCase().trim(),n=b.filter(s=>{const i=(s.rute1||"").toLowerCase(),o=(s.rute2||"").toLowerCase(),l=(s.vendor||"").toLowerCase(),d=(s.flight1||"").toLowerCase(),c=(s.flight2||"").toLowerCase();return i.includes(a)||o.includes(a)||l.includes(a)||d.includes(a)||c.includes(a)||a.includes("jakarta")&&(i.includes("cgk")||o.includes("cgk"))||a.includes("jeddah")&&(i.includes("jed")||o.includes("jed"))});L(n)})}const V=document.querySelectorAll(".tab-link"),yt=document.querySelectorAll(".tab-content");V.forEach(t=>{t.addEventListener("click",()=>{V.forEach(a=>a.classList.remove("active")),t.classList.add("active"),yt.forEach(a=>a.classList.remove("active-content"));const e=t.getAttribute("data-target");if(e){const a=document.getElementById(e);a&&a.classList.add("active-content")}})});document.addEventListener("click",async t=>{const e=t.target,a=e.closest(".btn-pilih");if(a){if(B){alert("Silakan login atau daftar terlebih dahulu untuk memesan tiket.");return}const i=a.closest(".ticket-wrapper"),o=i==null?void 0:i.dataset.flightId;if(o&&m.has(o)){m.delete(o),L(b),E();return}i==null||i.classList.toggle("active-booking"),a.innerText=i!=null&&i.classList.contains("active-booking")?"Batalkan":"Pilih Tiket";return}const n=e.closest(".btn-lanjut");if(n){const i=n.closest(".ticket-wrapper");if(!i)return;const o=i.dataset.flightId,l=Number(i.dataset.price)||0,d=i.querySelector('[data-field="name"]'),c=(d==null?void 0:d.value.trim())||"";if(!c){alert("Silakan masukkan Nama Lengkap penumpang terlebih dahulu!"),d==null||d.focus();return}const r=i.querySelector(".route");m.set(o,{flightId:o,routeLabel:(r==null?void 0:r.textContent)||"",passengerName:c,price:l}),L(b),E();return}if(e.closest(".btn-cart-clear")){if(m.size===0||!confirm("Kosongkan semua tiket yang dipilih?"))return;m.clear(),L(b),E();return}const s=e.closest(".btn-cart-checkout");if(s){if(!g.authStore.isValid){alert("Sesi Anda telah berakhir. Silakan login kembali."),window.location.href="/login.html";return}if(m.size===0)return;s.disabled=!0,s.textContent="Memproses…",await Q();const i=[];if(m.forEach((r,p)=>{const S=b.find(D=>D.id===p);S&&Z(S)<=0&&(i.push(r.routeLabel||p),m.delete(p))}),i.length>0&&(alert(`Maaf, tiket berikut sudah habis dan dihapus dari pesanan:
${i.join(`
`)}`),L(b),E(),m.size===0)){s.disabled=!1,s.textContent="Pesan Tiket";return}const o=Array.from(m.values()),l=[];let d=0;for(const r of o)try{const p=await fetch(`${lt}/api/midtrans/token`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:g.authStore.token},body:JSON.stringify({flightId:r.flightId,name:r.passengerName})}),S=await p.json().catch(()=>({}));if(!p.ok)throw new Error(S.error||`Gagal (${p.status})`);d++}catch(p){console.error("Gagal membuat pesanan:",r.flightId,p),l.push(r.routeLabel||r.flightId)}m.clear(),E(),l.length>0&&alert(`${d} pesanan berhasil dibuat.
${l.length} gagal:
${l.join(`
`)}`);const c=document.querySelector('[data-target="aktif"]');c==null||c.click()}});window.submitPayment=function(){alert("Konfirmasi pembayaran berhasil dikirim!")};window.requestVendorStatus=async function(){if(!(!v||B))try{if(!confirm("Apakah Anda yakin ingin mendaftar sebagai Vendor?"))return;await g.collection("users").update(v.id,{vendor:"pending"}),alert("Permintaan berhasil dikirim! Menunggu persetujuan Admin."),window.location.reload()}catch(t){console.error("Gagal mengirim permintaan:",t),alert("Terjadi kesalahan saat mendaftar vendor.")}};const tt="https://db.zizazu.my.id";let $=[],_="all",N;const et="tp_midtrans_accessed";function at(){try{const t=localStorage.getItem(et);return new Set(t?JSON.parse(t):[])}catch{return new Set}}function nt(t){const e=at();t.forEach(a=>e.add(a));try{localStorage.setItem(et,JSON.stringify([...e]))}catch{}}const vt={CGK:"Jakarta (CGK)",JED:"Jeddah (JED)",MED:"Madinah (MED)",SUB:"Surabaya (SUB)",DPS:"Bali (DPS)"},q={paid:"Lunas",pending:"Menunggu pembayaran",failed:"Kedaluwarsa"};function O(t){return vt[t]||t}function u(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function wt(t){return t?t.length===6?`${u(O(t.slice(0,3)))} &rarr; ${u(O(t.slice(3,6)))}`:u(t):""}function it(t){const e=Number(t);return!e||isNaN(e)?null:new Date(Math.round((e-25569)*86400*1e3))}function P(t){const e=it(t);return e?e.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"}):u(t)}function w(t){return"Rp "+(Number(t)||0).toLocaleString("id-ID")}function y(t,e){const a=document.getElementById(t);a&&(a.textContent=e)}function I(t){var a,n;if(typeof t.gross_amount=="number")return t.gross_amount;if(typeof t.amount=="number")return t.amount;if(typeof t.total=="number")return t.total;const e=((a=t.expand)==null?void 0:a.flight)??((n=t.expand)==null?void 0:n.flightId);return e?((Number(e.jual)||0)+(Number(e.markup)||0))*1e3:0}function C(t){const e=String(t.status??"").toLowerCase();return["paid","settlement","capture","success","lunas"].includes(e)?"paid":["expire","expired","cancel","deny","failure","failed"].includes(e)?"failed":"pending"}function $t(t){var a,n;const e=((a=t.expand)==null?void 0:a.flight)??((n=t.expand)==null?void 0:n.flightId);return e!=null&&e.dot?it(e.dot):t.departure?new Date(t.departure):null}async function k(){var e,a;const t=document.querySelector("#aktif .bk-list");if(t){if(!g.authStore.isValid){t.innerHTML=`
            <div class="bk-empty">
                <h3>Belum masuk</h3>
                <p>Masuk dulu untuk melihat pesanan tiket Anda.</p>
                <button onclick="window.location.href='/login.html'">Masuk</button>
            </div>`;return}try{const n=(e=g.authStore.model)==null?void 0:e.id,s=n?g.filter("user = {:userId}",{userId:n}):'id = ""';let i;try{i=await g.collection("bookings").getList(1,50,{sort:"-created",expand:"flight,flightId",filter:s})}catch{i=await g.collection("bookings").getList(1,50,{expand:"flight,flightId",filter:s})}$=i.items,K(),st($)}catch(n){console.error("Gagal memuat pesanan:",n.status,n.response),t.innerHTML=`
            <div class="bk-empty">
                <h3>Gagal memuat pesanan</h3>
                <p>${u(((a=n.response)==null?void 0:a.message)||n.message||"Kesalahan tidak diketahui")}</p>
            </div>`}}}function st(t){const e=t.filter(r=>C(r)!=="failed"),a=e.reduce((r,p)=>r+I(p),0),n=e.filter(r=>C(r)==="paid").reduce((r,p)=>r+I(p),0),s=a-n,i=e.filter(r=>C(r)==="pending"),o=a>0?Math.round(n/a*100):0,l=e.map($t).filter(r=>r instanceof Date&&!isNaN(r.getTime())).map(r=>Math.ceil((r.getTime()-Date.now())/864e5)).filter(r=>r>=0).sort((r,p)=>r-p)[0];y("sum-total",w(a)),y("sum-paid",w(n)),y("sum-due",w(s)),y("sum-percent",`${o}% lunas`),y("sum-active",String(e.length)),y("sum-pending",String(i.length)),y("sum-next",l!==void 0?`${l} hari`:"—");const d=document.getElementById("sum-bar");d&&(d.style.width=`${o}%`);const c=document.getElementById("btnPayAll");if(c){if(i.length===0){c.disabled=!0,c.textContent=e.length?"Semua lunas":"Belum ada pesanan",c.onclick=null;return}c.disabled=!1,c.textContent="Bayar sepenuhnya",c.onclick=()=>Lt(i,c)}}function K(){const t=document.querySelector("#aktif .bk-list");if(!t)return;const e=_==="all"?$:$.filter(a=>C(a)===_);if(e.length===0){t.innerHTML=`
            <div class="bk-empty">
                <h3>Belum ada pesanan</h3>
                <p>Tiket yang Anda pesan akan muncul di sini.</p>
                <button onclick="document.querySelector('[data-target=pembelian]').click()">Cari tiket</button>
            </div>`;return}t.innerHTML=e.map(St).join(""),xt()}function St(t){var r,p;const e=((r=t.expand)==null?void 0:r.flight)||((p=t.expand)==null?void 0:p.flightId)||{},a=C(t),n=I(t),s=String(e.vendor||"Garuda"),i=`${u(e.prog)} &middot; ${u(e.day)}`,o=`
        <div class="bk-details">
            <p class="bk-route">${wt(e.rute1)}</p>
            <div class="bk-meta-list">
                <div class="bk-meta">
                    <img src="/icon/calender-icon.png" alt="">
                    <span class="bk-leg-field" data-pergi="${P(e.dot)}" data-pulang="${P(e.dot_turn)}">${P(e.dot)}</span>
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
                        <span class="bk-price">${w(n)}</span>
                    </div>
                    <div class="bk-info-group">
                        <span class="bk-trip">${i}</span>
                        <span class="bk-payment">${u(t.payment_type||"—")}</span>
                    </div>
                </div>
                <div class="bk-booking-actions">
                    <span class="bk-status bk-status--paid">${u(q.paid)}</span>
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
                        <span class="bk-status bk-status--failed">${u(q.failed)}</span>
                        <span class="bk-trip">${i}</span>
                    </div>
                </div>
                <div class="bk-pending-row bk-row-bottom">
                    <div class="bk-info-group">
                        <span class="bk-label">Tagihan dibatalkan</span>
                        <span class="bk-price bk-price--void">${w(n)}</span>
                    </div>
                </div>
                <button class="bk-pay bk-pay--expired" disabled>Kedaluwarsa</button>
            </div>
        </div>`;const d=at().has(t.id),c=d?'<span class="bk-label">Sisa waktu</span><span class="bk-countdown">--:--:--</span>':'<span class="bk-note">Selesaikan pembayaran<br>sesuai instruksi</span>';return`
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
                    <span class="bk-status bk-status--pending">${u(q.pending)}</span>
                    <span class="bk-trip">${i}</span>
                </div>
            </div>
            <div class="bk-pending-row bk-row-bottom" data-expiry="${d?u(t.expiry_time||""):""}">
                <div class="bk-info-group">
                    <span class="bk-label">Total tagihan</span>
                    <span class="bk-price">${w(n)}</span>
                </div>
                <div class="bk-info-group bk-text-right">
                    ${c}
                </div>
            </div>
            <button class="bk-pay" data-order="${u(t.order_id)}" data-booking-id="${u(t.id)}">Bayar sekarang</button>
        </div>
    </div>`}function xt(){N&&window.clearInterval(N),F(),N=window.setInterval(F,1e3)}function F(){const t=[];document.querySelectorAll("#aktif .bk-row-bottom[data-expiry]").forEach(e=>{var r;const a=e.dataset.expiry,n=e.querySelector(".bk-countdown");if(!a||!n)return;const s=new Date(a.replace(" ","T")+"+07:00").getTime();if(isNaN(s)){n.textContent="--:--:--";return}const i=s-Date.now();if(i<=0){const p=(r=e.closest(".bk-card"))==null?void 0:r.dataset.id;p&&t.push(p);return}const o=Math.floor(i/36e5),l=Math.floor(i%36e5/6e4),d=Math.floor(i%6e4/1e3),c=p=>String(p).padStart(2,"0");n.textContent=`${c(o)}:${c(l)}:${c(d)}`,n.classList.toggle("bk-countdown--urgent",i<36e5)}),t.length>0&&(t.forEach(e=>{const a=$.find(n=>n.id===e);a&&(a.status="expired")}),setTimeout(()=>{K(),st($)},0))}async function Lt(t,e){if(!g.authStore.isValid){alert("Sesi Anda telah berakhir. Silakan login kembali."),window.location.href="/login.html";return}const a=t.length,n=t.reduce((s,i)=>s+I(i),0);if(confirm(`Bayar ${a} tagihan sekaligus senilai ${w(n)}?`)){e.disabled=!0,e.textContent="Memproses…";try{const s=await fetch(`${tt}/api/midtrans/token-bulk`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:g.authStore.token},body:JSON.stringify({bookingIds:t.map(o=>o.id)})}),i=await s.json().catch(()=>({}));if(!s.ok)throw new Error(i.error||`Gagal (${s.status})`);if(!window.snap)throw new Error("Modul pembayaran belum termuat. Muat ulang halaman.");nt(t.map(o=>o.id)),await k(),window.snap.pay(i.token,{onSuccess:()=>k(),onPending:()=>k(),onError:()=>{alert("Pembayaran gagal. Silakan coba lagi."),k()},onClose:()=>k()})}catch(s){console.error("Gagal membuat token pembayaran gabungan:",s),alert(s instanceof Error?s.message:"Terjadi kesalahan saat memproses pembayaran."),Et(e)}}}function Et(t){t.disabled=!1,t.textContent="Bayar sepenuhnya"}document.addEventListener("click",async t=>{const e=t.target,a=e.closest(".bk-filter");if(a){document.querySelectorAll(".bk-filter").forEach(i=>i.classList.remove("active")),a.classList.add("active"),_=a.dataset.status||"all",K();return}const n=e.closest(".bk-pay");if(n&&!n.disabled){n.disabled=!0,n.textContent="Memproses…";const i=n.dataset.bookingId||"",o=()=>{n.disabled=!1,n.textContent="Bayar sekarang"};try{const l=await fetch(`${tt}/api/midtrans/token`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:g.authStore.token},body:JSON.stringify({orderId:n.dataset.order})}),d=await l.json().catch(()=>({}));if(!l.ok||!d.token)throw new Error(d.error||`Gagal memuat pembayaran (${l.status}).`);if(!window.snap)throw new Error("Modul pembayaran belum termuat. Muat ulang halaman.");i&&nt([i]),await k(),window.snap.pay(d.token,{onSuccess:()=>k(),onPending:()=>k(),onError:()=>k(),onClose:()=>k()})}catch(l){alert(l instanceof Error?l.message:"Terjadi kesalahan."),o()}return}const s=e.closest(".bk-leg-toggle");if(s){const i=s.closest(".bk-card"),o=s.querySelector("span");if(!i||!o)return;const l=s.dataset.leg==="pergi",d=l?"pulang":"pergi";s.dataset.leg=d,o.textContent=l?"penerbangan pulang":"penerbangan pergi",i.querySelectorAll(".bk-leg-field").forEach(c=>{const r=c;r.textContent=r.dataset[d]||""})}});const j=document.querySelector('[data-target="aktif"]');j==null||j.addEventListener("click",()=>{$.length===0&&k()},{once:!0});document.querySelector("#aktif.active-content")&&k();const Ct={CGK:"Jakarta (CGK)",JED:"Jeddah (JED)",MED:"Madinah (MED)",SUB:"Surabaya (SUB)",DPS:"Bali (DPS)"},Mt={paid:"Lunas",pending:"Menunggu pembayaran",failed:"Kedaluwarsa"};let H=[],rt=!1;function W(t){return Ct[t]||t}function h(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Dt(t){return t?t.length===6?`${h(W(t.slice(0,3)))} &rarr; ${h(W(t.slice(3,6)))}`:h(t):""}function Tt(t){const e=Number(t);return!e||isNaN(e)?null:new Date(Math.round((e-25569)*86400*1e3))}function It(t){const e=Tt(t);return e?e.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"}):h(t)}function Bt(t){const e=new Date(String(t).replace(" ","T"));return isNaN(e.getTime())?"":e.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"})}function At(t){return"Rp "+(Number(t)||0).toLocaleString("id-ID")}function Nt(t){var a,n;if(typeof t.gross_amount=="number")return t.gross_amount;if(typeof t.amount=="number")return t.amount;if(typeof t.total=="number")return t.total;const e=((a=t.expand)==null?void 0:a.flight)??((n=t.expand)==null?void 0:n.flightId);return e?((Number(e.jual)||0)+(Number(e.markup)||0))*1e3:0}function qt(t){const e=String(t.status??"").toLowerCase();return["paid","settlement","capture","success","lunas"].includes(e)?"paid":["expire","expired","cancel","deny","failure","failed"].includes(e)?"failed":"pending"}async function ot(){var e,a;const t=document.querySelector("#riwayat-list");if(t){if(!g.authStore.isValid){t.innerHTML=`
            <div class="riwayat-empty">
                <h3>Belum masuk</h3>
                <p>Masuk dulu untuk melihat riwayat pemesanan Anda.</p>
                <button onclick="window.location.href='/login.html'">Masuk</button>
            </div>`;return}t.innerHTML='<div class="riwayat-loading">Memuat riwayat…</div>';try{const n=(e=g.authStore.model)==null?void 0:e.id,s=n?g.filter("user = {:userId}",{userId:n}):'id = ""';let i;try{i=await g.collection("bookings").getList(1,100,{sort:"-created",expand:"flight,flightId",filter:s})}catch{i=await g.collection("bookings").getList(1,100,{expand:"flight,flightId",filter:s})}H=i.items,rt=!0,Pt()}catch(n){console.error("Gagal memuat riwayat pemesanan:",n.status,n.response),t.innerHTML=`
            <div class="riwayat-empty">
                <h3>Gagal memuat riwayat</h3>
                <p>${h(((a=n.response)==null?void 0:a.message)||n.message||"Kesalahan tidak diketahui")}</p>
            </div>`}}}function Pt(){const t=document.querySelector("#riwayat-list");if(t){if(H.length===0){t.innerHTML=`
            <div class="riwayat-empty">
                <h3>Belum ada riwayat</h3>
                <p>Pesanan yang pernah Anda buat akan muncul di sini.</p>
                <button onclick="document.querySelector('[data-target=pembelian]').click()">Cari tiket</button>
            </div>`;return}t.innerHTML=H.map(jt).join("")}}function jt(t){var i,o;const e=((i=t.expand)==null?void 0:i.flight)||((o=t.expand)==null?void 0:o.flightId)||{},a=qt(t),n=Nt(t),s=String(e.vendor||"Garuda");return`
    <div class="riwayat-row">
        <div class="riwayat-airline">
            <img src="/assets/Airlines/${encodeURIComponent(s)}.png" alt="${h(s)}"
                 onerror="this.onerror=null; this.src='/Airlines/Garuda.png'">
        </div>

        <div class="riwayat-main">
            <span class="riwayat-route">${Dt(e.rute1)||"—"}</span>
            <span class="riwayat-meta">${Bt(t.created)||It(e.dot)} &middot; ${h(t.order_id)}</span>
        </div>

        <div class="riwayat-amount">${At(n)}</div>

        <span class="riwayat-status riwayat-status--${a}">${h(Mt[a])}</span>
    </div>`}const G=document.querySelector('[data-target="riwayat"]');G==null||G.addEventListener("click",()=>{rt||ot()});document.querySelector("#riwayat.active-content")&&ot();
