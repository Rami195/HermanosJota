// Carrito
// Array para guardar productos
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Elementos del carrito en el HTML
const cartIcon = document.getElementById("cart-icon");
const cartCount = document.getElementById("cart-count");
const cartDropdown = document.getElementById("cart-dropdown");
const cartItemsDiv = document.getElementById("cart-items");
const cartTotalDiv = document.getElementById("cart-total");
const cartCloseBtn = document.getElementById("cart-close");

// Actualiza el contador del carrito
function updateCartCount() {
  let total = 0;
  cart.forEach((item) => (total += item.qty));
  cartCount.textContent = total;
  cartCount.style.display = total > 0 ? "inline-block" : "none";
}
updateCartCount();

// Muestra los productos en el carrito
function renderCart() {
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>El carrito está vacío.</p>";
    cartTotalDiv.textContent = "";
    return;
  }
  let html = "";
  let total = 0;
  cart.forEach((item) => {
    html += `
                    <div>
                        <div>
                            <strong>${item.name}</strong><br>
                            <span>$${item.price} x ${item.qty}</span>
                        </div>
                        <div>
                            <button class="cart-minus" data-id="${item.id}">−</button>
                            <span>${item.qty}</span>
                            <button class="cart-plus" data-id="${item.id}">+</button>
                            <button class="cart-remove" data-id="${item.id}">🗑</button>
                        </div>
                    </div>
                `;
    total += item.price * item.qty;
  });
  cartItemsDiv.innerHTML = html;
  cartTotalDiv.textContent = "Total: $" + total;
}

// Muestra/oculta el carrito al hacer click en el ícono
cartIcon.onclick = function () {
  cartDropdown.style.display =
    cartDropdown.style.display === "none" ? "block" : "none";
  renderCart();
};

// Cierra el carrito al hacer click en "Cerrar"
cartCloseBtn.onclick = function () {
  cartDropdown.style.display = "none";
};

// Agrega un producto al carrito
function addToCart(id, name, price) {
  // Busca si ya está en el carrito
  let found = cart.find((item) => item.id === id);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({ id: id, name: name, price: price, qty: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

// Botón principal "Agregar al carrito"
document.getElementById("addCart")?.addEventListener("click", function () {
  // Toma el nombre y precio directamente del HTML
  const name = document.querySelector(".h1").textContent;
  const priceText = document.querySelector(".p-price").textContent;
  const price = parseInt(priceText.replace("$", "").replace(".", ""));
  // Usa el id del botón como identificador único
  const id = this.id;
  addToCart(id, name, price);
});

// Botones "Agregar" de productos similares
document.querySelectorAll(".p-card .btn.btn-primary").forEach((btn) => {
  btn.addEventListener("click", function () {
    // Toma el nombre y precio del producto similar
    const name =
      btn.parentElement.parentElement.querySelector(".p-name").textContent;
    const priceText =
      btn.parentElement.parentElement.querySelector(".p-price").textContent;
    const price = parseInt(priceText.replace("$", "").replace(".", ""));
    const id = btn.getAttribute("data-id");
    addToCart(id, name, price);
    btn.textContent = "Agregado ✔";
    setTimeout(() => (btn.textContent = "Agregar"), 1200);
  });
});

// Sumar, restar o eliminar productos desde el carrito
cartDropdown.addEventListener("click", function (e) {
  e.stopPropagation();
  let id = e.target.dataset.id;
  if (e.target.classList.contains("cart-plus")) {
    let item = cart.find((i) => i.id === id);
    if (item) item.qty += 1;
  }
  if (e.target.classList.contains("cart-minus")) {
    let item = cart.find((i) => i.id === id);
    if (item && item.qty > 1) item.qty -= 1;
  }
  if (e.target.classList.contains("cart-remove")) {
    cart = cart.filter((i) => i.id !== id);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
});

// Cierra el carrito si haces click fuera
document.addEventListener("click", function (e) {
  if (cartDropdown.contains(e.target)) return;
  if (cartIcon === e.target || cartIcon.contains(e.target)) return;
  cartDropdown.style.display = "none";
});
