import productos from './productos.js';
const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const numeroId = Number(id);


const producto = productos.find(p => p.id ===numeroId);
const contenedor = document.getElementById("container");
contenedor.innerHTML = `
<article class="card card-row">
            <!-- IMG + DESCRIPCIÓN -->
            <section class="media">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div class="desc">
                   ${producto.descripcion}
                </div>
            </section>

            <!-- INFO -->
            <section class="info">
                <span class="eyebrow">Línea Patagonia</span>
                <h1 class="h1">${producto.nombre}</h1>
                <p class="p-2 text-siena" style="font-weight:800; padding-left:0">$${producto.precio}</p>
                    <div class="mt-2">
                    <h3 class="h2" style="font-size:1rem">Color</h3>
                     <div class="colors">

                    </div>
                    
                    <div class="mt-3">
                    <h3 class="h2" style="font-size:1rem">Medidas y peso</h3>
                    <table class="table">
                        <tr>
                            <td>height</td>
                            <td>${producto.medidas.altura}</td>
                        </tr>
                        <tr>
                            <td>width</td>
                            <td>${producto.medidas.ancho}</td>
                        </tr>
                        <tr>
                            <td>depth</td>
                            <td>${producto.medidas.profundidad}</td>
                        </tr>
                        <tr>
                            <td>weight</td>
                            <td>${producto.medidas.peso}</td>
                        </tr>
                    </table>
                </div>
                <div class="mt-3">
                    <h3 class="h2" style="font-size:1rem">Materiales</h3>
                    <table class="table" id="materiales">
                            <td>${producto.materiales}</td>
                            </table>
                </div>
                <div class="mt-3" style="display:flex; gap:10px; align-items:center; flex-wrap:wrap">
                    <button class="btn btn-primary" id="addCart" data-id="${producto.id}"
                        data-name="${producto.nombre}">Agregar al carrito</button>
                    <a class="btn btn-ghost" href="./catalogo.html">Volver al catálogo</a>
                    <span id="hint" class="text-muted" aria-live="polite"></span>
                </div>
            </section>
        </article> `;





    const contenedorColores = document.querySelector(".colors");
    producto.colores.forEach(color => {
        contenedorColores.innerHTML += `
                           <button class="swatch" style="background:${color}" data-color="${color}"
                            aria-label="${color.nombre}"></button>
                    `;
    })

    
                

                