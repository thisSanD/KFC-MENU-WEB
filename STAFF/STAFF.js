// === FIREBASE ===
const firebaseConfig = {
    apiKey: "AIzaSyCDNxKsJNeMIGi6rOb_jFeYPnfEPWHcAgo",
    authDomain: "kfc-web-menu.firebaseapp.com",
    databaseURL: "https://kfc-web-menu-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "kfc-web-menu",
    storageBucket: "kfc-web-menu.firebasestorage.app",
    messagingSenderId: "1008060632643",
    appId: "1:1008060632643:web:e266309eeefde6ae1c0ef6",
    measurementId: "G-YYRVBBP87H"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database(app);

const orderList = document.getElementById("orderList");

// === MENAMPILKAN SEMUA PESANAN REALTIME ===
db.ref("orders").on("value", (snapshot) => {
    orderList.innerHTML = ""; // Bersihkan daftar sebelumnya

    snapshot.forEach((order) => {
        const data = order.val();
        const card = document.createElement("div");
        card.className = "order-card";

        // tampilkan semua item dengan gambar dan nama
        const itemsHTML = data.items
            .map(
                (item) => `
        <div class="item">
        <img src="../MENU/${item.img || 'PAKET/default.png'}" class="item-img">
          <span class="item-name">${item.name}</span>
          <span class="item-qty">× ${item.qty}</span>
        </div>
      `
            )
            .join("");

        card.innerHTML = `
      <h2>🪑 Meja ${data.table}</h2>
      <div class="item-list">${itemsHTML}</div>
      <div class="status">Status: <b>${data.status}</b></div>
      <div class="btn-row">
        <button class="process">Proses</button>
        <button class="ready">Pesanan Siap</button>
        <button class="delete">Hapus Pesanan</button>
      </div>
    `;

        // === Event tombol ===
        const processBtn = card.querySelector(".process");
        const readyBtn = card.querySelector(".ready");
        const deleteBtn = card.querySelector(".delete");

        processBtn.onclick = () => updateStatus(order.key, "processing");
        readyBtn.onclick = () => updateStatus(order.key, "ready");
        deleteBtn.onclick = () => deleteOrder(order.key);

        orderList.appendChild(card);
    });
});

// === UPDATE STATUS PESANAN ===
function updateStatus(orderId, status) {
    db.ref("orders/" + orderId + "/status").set(status)
        .then(() => console.log(`✅ Status pesanan ${orderId} diubah ke ${status}`))
        .catch(err => console.error("Gagal update status:", err));
}

// === HAPUS PESANAN ===
function deleteOrder(orderId) {
    if (confirm("Yakin ingin menghapus pesanan ini?")) {
        db.ref("orders/" + orderId).remove()
            .then(() => console.log(`🗑️ Pesanan ${orderId} dihapus.`))
            .catch(err => console.error("Gagal menghapus pesanan:", err));
    }
}
