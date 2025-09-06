import productos from "./productos.js";

const contenedor = document.getElementById("destacados");


const destacados = productos.filter(p => p.destacado).slice(0, 4);

// render súper simple: cada card es un <a> al detalle
destacados.forEach(p => {
  contenedor.innerHTML += `
    <a class="product-card" href="./product.html?id=${encodeURIComponent(p.id)}">
      <img src="${p.imagen}" alt="${p.nombre}" class="product-img">
      <div class="product-info">
        <h3 class="product-title">${p.nombre}</h3>
        <div class="informa-img">
          <p class="product-description">${p.descripcion ?? ""}</p>
          <p class="product-price">$${Number(p.precio).toLocaleString("es-AR")}</p>
        </div>
      </div>
    </a>
  `;
});
