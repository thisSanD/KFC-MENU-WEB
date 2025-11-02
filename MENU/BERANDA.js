document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll(".button-row");
  const cartBtn = document.getElementById("cartBtn");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const cartPanel = document.getElementById("cartPanel");
  const cartItemsContainer = document.getElementById("cartItems");
  const totalPriceEl = document.getElementById("totalPrice");

  let cart = [];

  const menuData = {
    kenyang: { price: 79000, img: "PAKET/paket-kenyang.png" },
    lapar: { price: 45000, img: "PAKET/paket-lapar.png" },
    hemat: { price: 34000, img: "PAKET/paket-hemat.png" },
    berkah: { price: 29000, img: "PAKET/paket-berkah.png" },
    bersama: { price: 160000, img: "PAKET/paket-bersama.png" },
    kids: { price: 54000, img: "PAKET/paket-kids.png" },
    supreme: { price: 75000, img: "PAKET/paket-supreme.png" },
    ayam1: { price: 55000, img: "PAKET/paket-ayam1.png" }
  };

  cartBtn.addEventListener("click", () => cartPanel.classList.toggle("active"));
  closeCartBtn.addEventListener("click", () => cartPanel.classList.remove("active"));

  menuItems.forEach(row => {
    const plusBtn = row.querySelector(".plus");
    const minusBtn = row.querySelector(".minus");
    const countEl = row.querySelector(".count");
    const addBtn = row.querySelector(".add-btn");
    const parent = row.parentElement;
    const menuName = parent.classList[0] ;
    let count = 0;

    plusBtn.addEventListener("click", () => {
      count++;
      countEl.textContent = count;
    });

    minusBtn.addEventListener("click", () => {
      if (count > 0) count--;
      countEl.textContent = count;
    });

    addBtn.addEventListener("click", () => {
      if (count > 0) {
        const existingItem = cart.find(item => item.name === menuName);
        if (existingItem) {
          existingItem.qty += count;
        } else {
          cart.push({
            name: menuName,
            qty: count,
            price: menuData[menuName].price,
            img: menuData[menuName].img,
            selected: false
          });
        }

        count = 0;
        countEl.textContent = 0;
        updateCart();
      } else {
        alert("Pilih jumlah dulu sebelum menambahkan!");
      }
    });
  });

  function updateCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      const subtotal = item.qty * item.price;
      total += item.selected ? subtotal : 0;

      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
      <input type="checkbox" class="select-item" ${item.selected ? "checked" : ""}>
      <img src="${item.img}" alt="${item.name}" class="cart-img">
      <div class="cart-info">
        <h3>Paket ${item.name.toUpperCase()}</h3>
        <p>Rp ${item.price.toLocaleString("id-ID")}</p>
        <div class="qty-control">
          <button class="minus-cart">-</button>
          <span class="qty">${item.qty}</span>
          <button class="plus-cart">+</button>
        </div>
      </div>
      <div class="cart-actions">
        <p>Rp ${(item.qty * item.price).toLocaleString("id-ID")}</p>
        <button class="remove-item" title="Hapus item">✕</button>
      </div>
    `;

      div.querySelector(".select-item").addEventListener("change", (e) => {
        item.selected = e.target.checked;
        updateCart();
      });

      div.querySelector(".plus-cart").addEventListener("click", () => {
        item.qty++;
        updateCart();
      });

      div.querySelector(".minus-cart").addEventListener("click", () => {
        if (item.qty > 1) {
          item.qty--;
        } else {
        }
        updateCart();
      });

      div.querySelector(".remove-item").addEventListener("click", () => {
        cart.splice(index, 1);
        updateCart();
      });

      cartItemsContainer.appendChild(div);
    });

    totalPriceEl.textContent = `Total: Rp ${total.toLocaleString("id-ID")}`;
  }
});

firebase.database().ref("orders").on("child_changed", snapshot => {
  const data = snapshot.val();
  if (data.status === "ready") {
    alert(`🍗 Pesanan Anda di meja ${data.table} sudah siap diambil!`);
  }
});
