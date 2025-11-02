// === KONFIGURASI FIREBASE ===
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database(app);
const orderList = document.getElementById("orderList");

// === MENAMPILKAN SEMUA PESANAN ===
firebase.database().ref("orders").on("value", snapshot => {
  orderList.innerHTML = ""; // reset
  snapshot.forEach(order => {
    const data = order.val();
    const card = document.createElement("div");
    card.className = "order-card";

    card.innerHTML = `
      <h2>🪑 Meja ${data.table}</h2>
      <div class="item-list">
        ${data.items.map(item => `<div class="item">🍗 ${item.name} x ${item.qty}</div>`).join("")}
      </div>
      <div class="status">Status: <b>${data.status}</b></div>
      <div class="btn-row">
        <button class="process">Proses</button>
        <button class="ready">Pesanan Siap</button>
      </div>
    `;

    const processBtn = card.querySelector(".process");
    const readyBtn = card.querySelector(".ready");

    processBtn.onclick = () => updateStatus(order.key, "processing");
    readyBtn.onclick = () => updateStatus(order.key, "ready");

    orderList.appendChild(card);
  });
});

// === FUNGSI UPDATE STATUS ===
function updateStatus(orderId, status) {
  firebase.database().ref("orders/" + orderId + "/status").set(status);

  // === Kirim notifikasi ke pelanggan ===
  // nanti di customer.js kita buat listener yg muncul kalau statusnya 'ready'
}
