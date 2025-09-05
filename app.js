// app.js  (usar <script type="module"> en tu HTML)
import productos from './productos.js';

const contenedor   = document.getElementById('catalogo-grid');
const paginacion   = document.getElementById('paginacion');   
const inputSearch  = document.getElementById('search');      
const selColor     = document.getElementById('color');        
const selCategory  = document.getElementById('category');     
const rangePrice   = document.getElementById('price');        
const priceValueEl = document.getElementById('priceValue');   

const formatearPrecio = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n ?? 0);

// ---------- Estado ----------
const PAGE_SIZE = 6;
let allProducts = [];  
let data        = [];  
let currentPage = 1;

// ---------- Utils ----------
const normalize = (s = "") =>
  s.toString().toLowerCase()
    .normalize('NFD')                   // separa acentos
    .replace(/[\u0300-\u036f]/g, '');   

const debounce = (fn, delay = 250) => {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
};

const CATEGORY_MAP = {
  'silla': 'silla', 'sillas': 'silla',
  'mesa': 'mesa',   'mesas': 'mesa',
  'sofa': 'sofa',   'sofas': 'sofa', 'sofás': 'sofa',
  'cama': 'cama',   'camas': 'cama',
  'otros': 'otros', 'bibliotecas': 'otros'
};
const mapCategory = (val) => CATEGORY_MAP[normalize(val)] ?? normalize(val);

// Heurística simple para “color” (si tus objetos traen .colores, se usa primero)
function colorMatches(p, selected) {
  if (selected === 'todos') return true;
  const colores = Array.isArray(p.colores) ? p.colores.map(normalize) : [];
  if (colores.includes(selected)) return true;

  const text = normalize([p.materiales, p.descripcion, p.nombre].join(' '));
  switch (selected) {
    case 'madera clara': return /roble|guatambu|guatamb[uú]|bambu|bamb[uú]|claro/.test(text);
    case 'madera oscura': return /nogal|cognac|oscura|oscuro/.test(text);
    case 'blanco': return /blanco|alabaster|lino/.test(text);
    default: return false;
  }
}

function updatePriceLabel() {
  if (!rangePrice || !priceValueEl) return;
  const val = Number(rangePrice.value || rangePrice.max || 0);
  priceValueEl.textContent = `Hasta ${formatearPrecio(val)}`;
}

// ---------- Paginación ----------
function renderPagination(totalPages) {
  if (!paginacion) return;
  if (totalPages <= 1) { paginacion.innerHTML = ''; return; }

  let html = `
    <button type="button" class="page-btn" data-page="prev" ${currentPage === 1 ? 'disabled' : ''}>Anterior</button>
  `;
  for (let i = 1; i <= totalPages; i++) {
    html += `
      <button type="button" class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}" ${i === currentPage ? 'aria-current="page"' : ''}>${i}</button>
    `;
  }
  html += `
    <button type="button" class="page-btn" data-page="next" ${currentPage === totalPages ? 'disabled' : ''}>Siguiente</button>
  `;

  paginacion.innerHTML = html;
}

function goToPage(n) {
  const totalPages = Math.ceil(data.length / PAGE_SIZE);

  if (totalPages === 0) {
    contenedor.innerHTML = `<p class="empty">No se encontraron productos.</p>`;
    paginacion.innerHTML = '';
    return;
  }

  currentPage = Math.max(1, Math.min(n, totalPages));
  const start = (currentPage - 1) * PAGE_SIZE;
  const end   = start + PAGE_SIZE;

  mostrarProductos(data.slice(start, end));
  renderPagination(totalPages);
}

// ---------- Simula fetch ----------
function fetchProducts() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(productos), 800); // 800 ms de “carga”
  });
}

// ---------- Render de cards ----------
function mostrarProductos(lista) {
  if (!contenedor) {
    console.error('No se encontró el contenedor #catalogo-grid');
    return;
  }
  contenedor.innerHTML = '';

  lista.forEach((producto) => {
    const card = document.createElement('div');
    card.classList.add('catalogo-card');
    card.innerHTML = `
      <img src="${encodeURI(producto.imagen)}" class="catalogo-img" alt="${producto.nombre}">
      <div class="catalogo-info">
        <h3>${producto.nombre}</h3>
        <p><strong>Stock disponible:</strong> ${producto.stock}</p>
        <span class="catalogo-price">$${producto.precio}</span>
      </div>
    `;
     card.addEventListener("click", () => {
        window.location.href = `product.html?id=${producto.id}`;
      });
    contenedor.appendChild(card);
  });
}

// ---------- Búsqueda + Filtros (core) ----------
function filterData() {
  let result = allProducts.slice();


  const q = normalize(inputSearch?.value || '').trim();
  if (q) {
    result = result.filter(p => {
      const nombre = normalize(p.nombre);
      const desc   = normalize(p.descripcion);
      const cat    = normalize(p.categoria);
      const mats   = normalize(p.materiales);
      return nombre.includes(q) || desc.includes(q) || cat.includes(q) || mats.includes(q);
    });
  }


  if (selCategory && normalize(selCategory.value) !== 'todos') {
    const wanted = mapCategory(selCategory.value);
    result = result.filter(p => normalize(p.categoria) === wanted);
  }


  if (selColor && normalize(selColor.value) !== 'todos') {
    const wantedColor = normalize(selColor.value);
    result = result.filter(p => colorMatches(p, wantedColor));
  }


  if (rangePrice) {
    const max = Number(rangePrice.value || rangePrice.max);
    result = result.filter(p => Number(p.precio) <= max);
  }

  data = result;
  goToPage(1);
}


paginacion?.addEventListener('click', (e) => {
  const btn = e.target.closest('.page-btn');
  if (!btn) return;
  const val = btn.dataset.page;
  if (val === 'prev') return goToPage(currentPage - 1);
  if (val === 'next') return goToPage(currentPage + 1);
  const num = parseInt(val, 10);
  if (!Number.isNaN(num)) goToPage(num);
});


inputSearch?.addEventListener('input', debounce(filterData, 250));
inputSearch?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); filterData(); }
});


selCategory?.addEventListener('change', filterData);
selColor?.addEventListener('change', filterData);

// rango de precio
rangePrice?.addEventListener('input', () => { updatePriceLabel(); filterData(); });

// ---------- Flujo principal ----------
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const lista = await fetchProducts();
    allProducts = lista.slice();
    data        = lista.slice();

    // valor inicial de precio (al máximo)
    if (rangePrice) {
      rangePrice.value = rangePrice.max;
      updatePriceLabel();
    }
    filterData(); // arranca con todos + paginación
  } catch (err) {
    console.error('Error fetching products:', err);
    if (contenedor) contenedor.innerHTML = `<p class="error">No se pudo cargar el catálogo.</p>`;
  }
});
