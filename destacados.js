// destacados.js  (ES Module)
import productos from './productos.js'; // ← importa el export default

const cont = document.getElementById('destacados');
if (!cont) throw new Error('Falta el contenedor #destacados');

function formatear(n) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n ?? 0);
}

// Tomo los que tengan destacado:true; si no hay, uso los 4 primeros
let items = productos.filter(p => p.destacado === true);
if (items.length === 0) items = productos.slice(0, 4);
items = items.slice(0, 4);

const frag = document.createDocumentFragment();
items.forEach(p => {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <img src="${p.imagen}" alt="${p.nombre}" class="product-img">
    <div class="product-info">
      <h3 class="product-title">${p.nombre}</h3>
      <div class="informa-img">
        <p class="product-description">${p.descripcion ?? ''}</p>
        <p class="product-price">${formatear(p.precio)}</p>
      </div>
    </div>
  `;
  // opcional: link al detalle
  card.addEventListener('click', () => location.href = `product.html?id=${p.id}`);
  frag.appendChild(card);
});
cont.replaceChildren(frag);
