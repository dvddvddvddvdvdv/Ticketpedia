import{p as m}from"./pocketbase-BLeLc1eM.js";const H="https://db.zizazu.my.id",U={CGK:"Jakarta (CGK)",JED:"Jeddah (Jeddah)",MED:"Medan (Medan)",SUB:"Surabaya (Surabaya)",JEDJED:"Jeddah (Jeddah)"};function j(e){return U[e]||e}function G(e){const t=Number(e);return!t||isNaN(t)?String(e):new Date(Math.round((t-25569)*86400*1e3)).toLocaleDateString("id-ID",{day:"2-digit",month:"short"})}function p(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function T(e){return e?e.length===6?`${p(j(e.slice(0,3)))} &rarr; ${p(j(e.slice(3,6)))}`:p(e):""}function F(e){return"Rp "+e.toLocaleString("id-ID")}let y=[];const g=new Map;function O(){let e=0;return g.forEach(t=>e+=t.price),e}function E(){const e=document.querySelector("#cart-bar");if(e){if(g.size===0){e.innerHTML="",e.style.display="none";return}e.style.display="flex",e.innerHTML=`
        <div class="cart-info">
            <strong>${g.size}</strong> tiket dipilih &middot;
            <span class="cart-total">${F(O())}</span>
        </div>
        <div class="cart-actions">
            <button class="btn-cart-clear" type="button">Kosongkan</button>
            <button class="btn-cart-checkout" type="button">Pesan Tiket</button>
        </div>
    `}}const P=!m.authStore.isValid,b=m.authStore.record,x=m.authStore.isSuperuser,N=b?b.vendor||"user":null,W=N==="user"&&!x,X=N==="pending"&&!x,Q=N==="approved"&&!x,v=document.querySelector("#navUsername"),B=document.querySelector("#navEmail");var R;!P&&b?(v&&(v.textContent=b.username||"User"),B&&(B.textContent=b.email||"")):x?(v&&(v.textContent="Admin"),B&&(B.textContent=((R=m.authStore.record)==null?void 0:R.email)||"")):v&&(v.textContent="Guest");function Y(){const e=document.querySelector("#loginBtn"),t=document.querySelector("#applyVendorBtn"),a=document.querySelector("#pendingVendorStatus"),s=document.querySelector("#vendorDashboardBtn"),i=document.querySelector("#adminPanelBtn");t&&(t.style.display="none"),a&&(a.style.display="none"),s&&(s.style.display="none"),i&&(i.style.display="none"),e&&(e.style.display=P?"block":"none"),W?t&&(t.style.display="block"):X?a&&(a.style.display="block"):Q?s&&(s.style.display="block"):x&&i&&(i.style.display="block")}Y();Z();async function Z(){try{y=await m.collection("flights").getFullList(),S(y),ee()}catch(e){console.error("Error fetching flights from PocketBase:",e)}}function S(e){const t=document.querySelector(".ticket-list");if(t){if(e.length===0){t.innerHTML=`
            <div style="text-align:center; padding:20px; color:#666;">
                Tidak ada penerbangan yang ditemukan.
            </div>`;return}t.innerHTML=e.map(a=>{var o;const s=Number(a.jual)||0,i=Number(a.markup)||0,n=(s+i)*1e3,r=n.toLocaleString("id-ID"),d=String(a.vendor||"Garuda"),u=`/Airlines/${encodeURIComponent(d)}.png`;`${a.rute1?T(a.rute1).replace(/&rarr;|&amp;/g," - "):""}`;const l=g.has(a.id);return`
        <div class="ticket-wrapper" data-flight-id="${p(a.id)}" data-price="${n}">
            <div class="ticket-card">
                <div class="airline-info">
                    <img src="${u}" alt="${p(d)}"
                         onerror="this.onerror=null; this.src='/Airlines/Garuda.png'">
                </div>

                <div class="flight-details">
                    <div class="flight-leg">
                        <div class="route">Pergi: ${T(a.rute1)}</div>
                        <div class="time-details">
                            <span><img src="/icon/calender-icon.png" alt=""> ${p(G(a.dot))}</span>
                            <span class="divider">|</span>
                            <span>${p(a.time1)}</span>
                            <span class="divider">|</span>
                            <span class="time-date"><img src="/icon/time-icon.png" alt=""> ${p(a.flight1)}</span>
                        </div>
                    </div>

                    <div class="flight-leg">
                        <div class="route">Pulang: ${T(a.rute2)}</div>
                        <div class="time-details">
                            <span><img src="/icon/plane-icon.png" alt=""> ${p(G(a.dot_turn))}</span>
                            <span class="divider">|</span>
                            <span>${p(a.time2)}</span>
                            <span class="divider">|</span>
                            <span class="time-date"><img src="/icon/time-icon.png" alt=""> ${p(a.flight2)}</span>
                        </div>
                    </div>
                </div>

                <div class="price-container">
                    <div class="duration">Durasi: ${p(a.prog)} (${p(a.day)})</div>
                    <div class="price">Rp ${r}</div>
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
                               placeholder="Masukkan nama lengkap" value="${p(((o=g.get(a.id))==null?void 0:o.passengerName)||"")}">
                    </div>
                </div>

                <div class="booking-footer">
                    <div class="total-price">
                        Harga per orang: <span>Rp ${r}</span>
                    </div>
                    <button class="btn-lanjut" type="button">${l?"Perbarui di Pesanan":"Tambah ke Pesanan"}</button>
                </div>
            </div>
        </div>`}).join(""),g.forEach((a,s)=>{const i=t.querySelector(`[data-flight-id="${s}"]`);i==null||i.classList.add("active-booking")})}}function ee(){const e=document.querySelector('input[placeholder*="Search"], .search-bar, input[type="text"]');e&&e.addEventListener("input",t=>{const a=t.target.value.toLowerCase().trim(),s=y.filter(i=>{const n=(i.rute1||"").toLowerCase(),r=(i.rute2||"").toLowerCase(),d=(i.vendor||"").toLowerCase(),u=(i.flight1||"").toLowerCase(),l=(i.flight2||"").toLowerCase();return n.includes(a)||r.includes(a)||d.includes(a)||u.includes(a)||l.includes(a)||a.includes("jakarta")&&(n.includes("cgk")||r.includes("cgk"))||a.includes("jeddah")&&(n.includes("jed")||r.includes("jed"))});S(s)})}const J=document.querySelectorAll(".tab-link"),te=document.querySelectorAll(".tab-content");J.forEach(e=>{e.addEventListener("click",()=>{J.forEach(a=>a.classList.remove("active")),e.classList.add("active"),te.forEach(a=>a.classList.remove("active-content"));const t=e.getAttribute("data-target");if(t){const a=document.getElementById(t);a&&a.classList.add("active-content")}})});document.addEventListener("click",async e=>{const t=e.target,a=t.closest(".btn-pilih");if(a){if(P){alert("Silakan login atau daftar terlebih dahulu untuk memesan tiket.");return}const n=a.closest(".ticket-wrapper"),r=n==null?void 0:n.dataset.flightId;if(r&&g.has(r)){g.delete(r),S(y),E();return}n==null||n.classList.toggle("active-booking"),a.innerText=n!=null&&n.classList.contains("active-booking")?"Batalkan":"Pilih Tiket";return}const s=t.closest(".btn-lanjut");if(s){const n=s.closest(".ticket-wrapper");if(!n)return;const r=n.dataset.flightId,d=Number(n.dataset.price)||0,u=n.querySelector('[data-field="name"]'),l=(u==null?void 0:u.value.trim())||"";if(!l){alert("Silakan masukkan Nama Lengkap penumpang terlebih dahulu!"),u==null||u.focus();return}const o=n.querySelector(".route");g.set(r,{flightId:r,routeLabel:(o==null?void 0:o.textContent)||"",passengerName:l,price:d}),S(y),E();return}if(t.closest(".btn-cart-clear")){if(g.size===0||!confirm("Kosongkan semua tiket yang dipilih?"))return;g.clear(),S(y),E();return}const i=t.closest(".btn-cart-checkout");if(i){if(!m.authStore.isValid){alert("Sesi Anda telah berakhir. Silakan login kembali."),window.location.href="/login.html";return}if(g.size===0)return;i.disabled=!0,i.textContent="Memproses…";const n=Array.from(g.values()),r=[];let d=0;for(const l of n)try{const o=await fetch(`${H}/api/midtrans/token`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:m.authStore.token},body:JSON.stringify({flightId:l.flightId,name:l.passengerName})}),f=await o.json().catch(()=>({}));if(!o.ok)throw new Error(f.error||`Gagal (${o.status})`);d++}catch(o){console.error("Gagal membuat pesanan:",l.flightId,o),r.push(l.routeLabel||l.flightId)}g.clear(),E(),r.length>0&&alert(`${d} pesanan berhasil dibuat.
${r.length} gagal:
${r.join(`
`)}`);const u=document.querySelector('[data-target="aktif"]');u==null||u.click()}});window.submitPayment=function(){alert("Konfirmasi pembayaran berhasil dikirim!")};window.requestVendorStatus=async function(){if(!(!b||P))try{if(!confirm("Apakah Anda yakin ingin mendaftar sebagai Vendor?"))return;await m.collection("users").update(b.id,{vendor:"pending"}),alert("Permintaan berhasil dikirim! Menunggu persetujuan Admin."),window.location.reload()}catch(e){console.error("Gagal mengirim permintaan:",e),alert("Terjadi kesalahan saat mendaftar vendor.")}};const _="https://db.zizazu.my.id";let L=[],q="all";const ae={CGK:"Jakarta (CGK)",JED:"Jeddah (JED)",MED:"Madinah (MED)",SUB:"Surabaya (SUB)",DPS:"Bali (DPS)"},M={paid:"Lunas",pending:"Menunggu pembayaran",failed:"Kedaluwarsa"};function K(e){return ae[e]||e}function c(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ne(e){return e?e.length===6?`${c(K(e.slice(0,3)))} &rarr; ${c(K(e.slice(3,6)))}`:c(e):""}function z(e){const t=Number(e);return!t||isNaN(t)?null:new Date(Math.round((t-25569)*86400*1e3))}function A(e){const t=z(e);return t?t.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"}):c(e)}function h(e){return"Rp "+(Number(e)||0).toLocaleString("id-ID")}function k(e,t){const a=document.getElementById(e);a&&(a.textContent=t)}function C(e){var a,s;if(typeof e.gross_amount=="number")return e.gross_amount;if(typeof e.amount=="number")return e.amount;if(typeof e.total=="number")return e.total;const t=((a=e.expand)==null?void 0:a.flight)??((s=e.expand)==null?void 0:s.flightId);return t?((Number(t.jual)||0)+(Number(t.markup)||0))*1e3:0}function w(e){const t=String(e.status??"").toLowerCase();return["paid","settlement","capture","success","lunas"].includes(t)?"paid":["expire","expired","cancel","deny","failure","failed"].includes(t)?"failed":"pending"}function ie(e){var a,s;const t=((a=e.expand)==null?void 0:a.flight)??((s=e.expand)==null?void 0:s.flightId);return t!=null&&t.dot?z(t.dot):e.departure?new Date(e.departure):null}async function $(){var t;const e=document.querySelector("#aktif .bk-list");if(e){if(!m.authStore.isValid){e.innerHTML=`
            <div class="bk-empty">
                <h3>Belum masuk</h3>
                <p>Masuk dulu untuk melihat pesanan tiket Anda.</p>
                <button onclick="window.location.href='/login.html'">Masuk</button>
            </div>`;return}try{let a;try{a=await m.collection("bookings").getList(1,50,{sort:"-created",expand:"flight,flightId"})}catch{a=await m.collection("bookings").getList(1,50,{expand:"flight,flightId"})}L=a.items,V(),se(L)}catch(a){console.error("Gagal memuat pesanan:",a.status,a.response),e.innerHTML=`
            <div class="bk-empty">
                <h3>Gagal memuat pesanan</h3>
                <p>${c(((t=a.response)==null?void 0:t.message)||a.message||"Kesalahan tidak diketahui")}</p>
            </div>`}}}function se(e){const t=e.filter(o=>w(o)!=="failed"),a=t.reduce((o,f)=>o+C(f),0),s=t.filter(o=>w(o)==="paid").reduce((o,f)=>o+C(f),0),i=a-s,n=t.filter(o=>w(o)==="pending"),r=a>0?Math.round(s/a*100):0,d=t.map(ie).filter(o=>o instanceof Date&&!isNaN(o.getTime())).map(o=>Math.ceil((o.getTime()-Date.now())/864e5)).filter(o=>o>=0).sort((o,f)=>o-f)[0];k("sum-total",h(a)),k("sum-paid",h(s)),k("sum-due",h(i)),k("sum-percent",`${r}% lunas`),k("sum-active",String(t.length)),k("sum-pending",String(n.length)),k("sum-next",d!==void 0?`${d} hari`:"—");const u=document.getElementById("sum-bar");u&&(u.style.width=`${r}%`);const l=document.getElementById("btnPayAll");if(l){if(n.length===0){l.disabled=!0,l.textContent=t.length?"Semua lunas":"Belum ada pesanan",l.onclick=null;return}l.disabled=!1,l.textContent="Bayar sepenuhnya",l.onclick=()=>oe(n,l)}}function V(){const e=document.querySelector("#aktif .bk-list");if(!e)return;const t=q==="all"?L:L.filter(a=>w(a)===q);if(t.length===0){e.innerHTML=`
            <div class="bk-empty">
                <h3>Belum ada pesanan</h3>
                <p>Tiket yang Anda pesan akan muncul di sini.</p>
                <button onclick="document.querySelector('[data-target=pembelian]').click()">Cari tiket</button>
            </div>`;return}e.innerHTML=t.map(re).join("")}function re(e){var u,l;const t=((u=e.expand)==null?void 0:u.flight)||((l=e.expand)==null?void 0:l.flightId)||{},a=w(e),s=C(e),i=String(t.vendor||"Garuda"),n=`${c(t.prog)} &middot; ${c(t.day)}`,r=`
        <div class="bk-details">
            <p class="bk-route">${ne(t.rute1)}</p>
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
            ${r}

            <div class="bk-booking">
                <div class="bk-booking-info">
                    <div class="bk-info-group">
                        <span class="bk-label">Kode pemesanan</span>
                        <span class="bk-value">${c(e.order_id)}</span>
                    </div>
                    <div class="bk-info-group">
                        <span class="bk-label">Total bayar</span>
                        <span class="bk-price">${h(s)}</span>
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
            ${r}

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
                        <span class="bk-price bk-price--void">${h(s)}</span>
                    </div>
                </div>
                <button class="bk-pay bk-pay--expired" disabled>Kedaluwarsa</button>
            </div>
        </div>`:`
    <div class="bk-card" data-id="${c(e.id)}">
        ${d}
        ${r}

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
                    <span class="bk-price">${h(s)}</span>
                </div>
                <div class="bk-info-group bk-text-right">
                    <span class="bk-note">Selesaikan pembayaran<br>sesuai instruksi</span>
                </div>
            </div>
            <button class="bk-pay" data-order="${c(e.order_id)}">Bayar sekarang</button>
        </div>
    </div>`}async function oe(e,t){if(!m.authStore.isValid){alert("Sesi Anda telah berakhir. Silakan login kembali."),window.location.href="/login.html";return}const a=e.length,s=e.reduce((i,n)=>i+C(n),0);if(confirm(`Bayar ${a} tagihan sekaligus senilai ${h(s)}?`)){t.disabled=!0,t.textContent="Memproses…";try{const i=await fetch(`${_}/api/midtrans/token-bulk`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:m.authStore.token},body:JSON.stringify({bookingIds:e.map(r=>r.id)})}),n=await i.json().catch(()=>({}));if(!i.ok)throw new Error(n.error||`Gagal (${i.status})`);if(!window.snap)throw new Error("Modul pembayaran belum termuat. Muat ulang halaman.");window.snap.pay(n.token,{onSuccess:()=>$(),onPending:()=>$(),onError:()=>{alert("Pembayaran gagal. Silakan coba lagi."),D(t)},onClose:()=>D(t)})}catch(i){console.error("Gagal membuat token pembayaran gabungan:",i),alert(i instanceof Error?i.message:"Terjadi kesalahan saat memproses pembayaran."),D(t)}}}function D(e){e.disabled=!1,e.textContent="Bayar sepenuhnya"}document.addEventListener("click",async e=>{const t=e.target,a=t.closest(".bk-filter");if(a){document.querySelectorAll(".bk-filter").forEach(n=>n.classList.remove("active")),a.classList.add("active"),q=a.dataset.status||"all",V();return}const s=t.closest(".bk-pay");if(s&&!s.disabled){s.disabled=!0,s.textContent="Memproses…";const n=()=>{s.disabled=!1,s.textContent="Bayar sekarang"};try{const r=await fetch(`${_}/api/midtrans/token`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:m.authStore.token},body:JSON.stringify({orderId:s.dataset.order})}),d=await r.json().catch(()=>({}));if(!r.ok||!d.token)throw new Error(d.error||`Gagal memuat pembayaran (${r.status}).`);if(d.orderId&&(s.dataset.order=d.orderId),!window.snap)throw new Error("Modul pembayaran belum termuat. Muat ulang halaman.");window.snap.pay(d.token,{onSuccess:()=>$(),onPending:()=>$(),onError:n,onClose:n})}catch(r){alert(r instanceof Error?r.message:"Terjadi kesalahan."),n()}return}const i=t.closest(".bk-leg-toggle");if(i){const n=i.closest(".bk-card"),r=i.querySelector("span");if(!n||!r)return;const d=i.dataset.leg==="pergi",u=d?"pulang":"pergi";i.dataset.leg=u,r.textContent=d?"penerbangan pulang":"penerbangan pergi",n.querySelectorAll(".bk-leg-field").forEach(l=>{const o=l;o.textContent=o.dataset[u]||""})}});const I=document.querySelector('[data-target="aktif"]');I==null||I.addEventListener("click",()=>{L.length===0&&$()},{once:!0});document.querySelector("#aktif.active-content")&&$();
