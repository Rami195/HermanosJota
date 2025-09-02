import productos from './productos.js';
function fetchProducts() {
    try {
        const response = productos
        const prod = response.json;
        return prod;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

fetchProducts();
console.log("1", fetchProducts());





    const contenedor = document.getElementById("catalogo-grid");

    function mostrarProductos(productos) {
        contenedor.innerHTML = ""; // limpiar antes de renderizar
        productos.forEach(producto => {
            const card = document.createElement("div");
            card.classList.add("catalogo-card");

            card.innerHTML = `
                    <img src="${producto.imagen}" class="catalogo-img" alt="${producto.nombre}">
                    <div class="catalogo-info">
                        <h3>${producto.nombre}</h3>
                        <p>${producto.descripcion}</p>
                        <span class="catalogo-price">$${producto.precio}</span>
                    </div>
    `;

            ;

            contenedor.appendChild(card);
        });
    }

    // simular carga asíncrona
    setTimeout(() => {
        mostrarProductos(productos);
    }, 1000);





