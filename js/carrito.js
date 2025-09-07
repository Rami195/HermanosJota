
import productos from "./productos.js";

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ---- Elements
const cartIcon      = document.getElementById("cart-icon");
const cartCount     = document.getElementById("cart-count");
const cartDropdown  = document.getElementById("cart-dropdown");
const cartItemsDiv  = document.getElementById("cart-items");
const cartTotalDiv  = document.getElementById("cart-total");
const cartCloseBtn  = document.getElementById("cart-close");

// ---- Utils
const normId = (v) => String(v);
const fmtAR  = new Intl.NumberFormat("es-AR");

// ---- Counter
function updateCartCount() {
  const total = cart.reduce((acc, it) => acc + it.qty, 0);
  cartCount.textContent = total;
  cartCount.style.display = total > 0 ? "inline-block" : "none";
}
updateCartCount();

// ---- Render
function renderCart() {
  if (!cart.length) {
    cartItemsDiv.innerHTML = "<p>El carrito está vacío.</p>";
    cartTotalDiv.textContent = "";
    return;
  }
  let total = 0;
  const rows = cart.map((item) => {
    const line = item.price * item.qty;
    total += line;
    return `
      <div>
        <div>
          <strong>${item.name}</strong><br>
          <span>$${fmtAR.format(item.price)} x ${item.qty}</span>
        </div>
        <div>
          <button class="cart-minus"  data-id="${item.id}">−</button>
          <span>${item.qty}</span>
          <button class="cart-plus"   data-id="${item.id}">+</button>
          <button class="cart-remove" data-id="${item.id}">🗑</button>
        </div>
      </div>`;
  }).join("");

  cartItemsDiv.innerHTML = rows;
  cartTotalDiv.textContent = "Total: $" + fmtAR.format(total);
}

// ---- Persist helpers
function persist() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

// ---- Core: SIEMPRE tomar nombre y precio desde productos.js
function addToCart(rawId) {
  const id = normId(rawId);
  const prod = productos.find(p => normId(p.id) === id);
  if (!prod) return; // id inválido

  const found = cart.find(it => normId(it.id) === id);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({
      id: prod.id,
      name: prod.nombre,
      price: Number(prod.precio),
      qty: 1
    });
  }
  persist();
}


cartIcon?.addEventListener("click", () => {
  const visible = cartDropdown.style.display === "block";
  cartDropdown.style.display = visible ? "none" : "block";
  renderCart();
});
cartCloseBtn?.addEventListener("click", () => cartDropdown.style.display = "none");

document.addEventListener("click", (e) => {
  if (cartDropdown.contains(e.target)) return;
  if (cartIcon === e.target || cartIcon?.contains(e.target)) return;
  cartDropdown.style.display = "none";
});

// ---- Botón principal del detalle
document.getElementById("addCart")?.addEventListener("click", function () {
  // ID confiable desde data-id (detalle.js ya lo setea) o desde ?id=
  const idFromDataset = this.dataset?.id;
  const idFromQS = new URLSearchParams(location.search).get("id");
  const id = idFromDataset ?? idFromQS;
  if (!id) return;
  addToCart(id);
});

// ---- Botones "Agregar" de similares (solo usamos data-id)
document.querySelectorAll(".p-card .btn.btn-primary").forEach((btn) => {
  btn.addEventListener("click", function () {
    const id = btn.getAttribute("data-id");
    if (!id) return;
    addToCart(id);

    const prev = btn.textContent;
    btn.textContent = "Agregado ✔";
    setTimeout(() => (btn.textContent = prev || "Agregar"), 1200);
  });
});

// ---- Acciones dentro del dropdown
cartDropdown?.addEventListener("click", (e) => {
  e.stopPropagation();
  const t  = e.target;
  if (!(t instanceof HTMLElement)) return;

  const id = normId(t.dataset.id);
  if (!id) return;

  if (t.classList.contains("cart-plus")) {
    const item = cart.find(i => normId(i.id) === id);
    if (item) item.qty += 1;
  } else if (t.classList.contains("cart-minus")) {
    const item = cart.find(i => normId(i.id) === id);
    if (item && item.qty > 1) item.qty -= 1;
  } else if (t.classList.contains("cart-remove")) {
    cart = cart.filter(i => normId(i.id) !== id);
  }
  persist();
});
