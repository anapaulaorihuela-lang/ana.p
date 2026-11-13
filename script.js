/* =====================================
   YOU ONLINE STORE 🛒
   JavaScript - Carrito y pedidos
===================================== */

// Número de WhatsApp de Bolivia
const numeroWhatsApp = "59172821393";

// Carrito de compras
let carrito = [];

// Elementos del HTML
const contenidoCarrito = document.getElementById("contenido-carrito");
const totalCarrito = document.getElementById("total-carrito");
const botonVaciar = document.getElementById("vaciar-carrito");
const botonContinuar = document.getElementById("continuar-pedido");
const formularioPedido = document.getElementById("pedido-form");

// Formatear precios
function formatoPrecio(precio) {
    return "Bs. " + precio.toFixed(2);
}

// Obtener el precio de cada producto
function obtenerPrecio(texto) {
    const coincidencia = texto.match(/\d+(?:[.,]\d{1,2})?/);

    if (!coincidencia) return 0;

    return parseFloat(coincidencia[0].replace(",", "."));
}

// Mostrar el carrito
function mostrarCarrito() {
    if (!contenidoCarrito) return;

    contenidoCarrito.innerHTML = "";

    if (carrito.length === 0) {
        contenidoCarrito.innerHTML = "<p>Tu carrito está vacío 🛒</p>";
    } else {
        carrito.forEach((producto, indice) => {
            const subtotal = producto.precio * producto.cantidad;

            const elemento = document.createElement("div");
            elemento.className = "item-carrito";

            elemento.innerHTML = `
                <div>
                    <strong>${producto.nombre}</strong>
                    <p>${formatoPrecio(producto.precio)} x ${producto.cantidad}</p>
                    <strong>${formatoPrecio(subtotal)}</strong>
                </div>

                <div class="controles-carrito">
                    <button type="button" data-accion="menos" data-indice="${indice}">−</button>
                    <span>${producto.cantidad}</span>
                    <button type="button" data-accion="mas" data-indice="${indice}">+</button>
                    <button type="button" data-accion="eliminar" data-indice="${indice}">🗑️</button>
                </div>
            `;

            contenidoCarrito.appendChild(elemento);
        });
    }

    const total = carrito.reduce(
        (suma, producto) => suma + producto.precio * producto.cantidad,
        0
    );

    if (totalCarrito) {
        totalCarrito.textContent = formatoPrecio(total);
    }
}

// Agregar productos al carrito
document.addEventListener("click", function(evento) {
    const boton = evento.target.closest("button");

    if (!boton) return;

    // Detectar botones de productos
    if (boton.textContent.trim().toLowerCase().includes("agregar al carrito")) {
        const tarjeta = boton.closest("article");

        if (!tarjeta) return;

        const titulo = tarjeta.querySelector("h3, h4");
        const precioTexto = tarjeta.querySelector("p");

        if (!titulo || !precioTexto) return;

        const nombre = titulo.textContent.trim();
        const precio = obtenerPrecio(precioTexto.textContent);

        if (precio <= 0) {
            alert("No se pudo identificar el precio de este producto.");
            return;
        }

        const productoExistente = carrito.find(
            producto => producto.nombre === nombre
        );

        if (productoExistente) {
            productoExistente.cantidad++;
        } else {
            carrito.push({
                nombre: nombre,
                precio: precio,
                cantidad: 1
            });
        }

        mostrarCarrito();
        alert("¡Producto agregado al carrito! 🛒");
    }
});

// Controles para aumentar, disminuir o eliminar productos
if (contenidoCarrito) {
    contenidoCarrito.addEventListener("click", function(evento) {
        const boton = evento.target.closest("button");

        if (!boton) return;

        const indice = Number(boton.dataset.indice);
        const accion = boton.dataset.accion;

        if (!carrito[indice]) return;

        if (accion === "mas") {
            carrito[indice].cantidad++;
        }

        if (accion === "menos") {
            carrito[indice].cantidad--;

            if (carrito[indice].cantidad <= 0) {
                carrito.splice(indice, 1);
            }
        }

        if (accion === "eliminar") {
            carrito.splice(indice, 1);
        }

        mostrarCarrito();
    });
}

// Vaciar el carrito
if (botonVaciar) {
    botonVaciar.addEventListener("click", function() {
        if (carrito.length === 0) {
            alert("Tu carrito ya está vacío.");
            return;
        }

        if (confirm("¿Estás segura de que deseas vaciar tu carrito?")) {
            carrito = [];
            mostrarCarrito();
        }
    });
}

// Preparar el pedido
function prepararPedido() {
    if (carrito.length === 0) {
        alert("Primero debes agregar productos al carrito.");
        return false;
    }

    const lista = document.getElementById("lista");

    if (lista) {
        lista.value = carrito.map(producto => {
            return `${producto.nombre} x${producto.cantidad} - ${formatoPrecio(producto.precio * producto.cantidad)}`;
        }).join("\n");
    }

    return true;
}

// Continuar con el pedido
if (botonContinuar) {
    botonContinuar.addEventListener("click", function() {
        if (!prepararPedido()) return;

        const formulario = document.getElementById("pedido");

        if (formulario) {
            formulario.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
}

// Mostrar u ocultar dirección según el tipo de entrega
const tipoEntrega = document.getElementById("entrega");
const campoDireccion = document.getElementById("direccion");

function actualizarDireccion() {
    if (!tipoEntrega || !campoDireccion) return;

    const contenedor = campoDireccion.closest("div");

    if (contenedor) {
        contenedor.style.display =
            tipoEntrega.value === "domicilio" ? "block" : "none";
    }
}

if (tipoEntrega) {
    tipoEntrega.addEventListener("change", actualizarDireccion);
    actualizarDireccion();
}

// Enviar pedido por WhatsApp
if (formularioPedido) {
    formularioPedido.addEventListener("submit", function(evento) {
        evento.preventDefault();

        if (!prepararPedido()) return;

        const nombre = document.getElementById("nombre").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const entrega = document.getElementById("entrega").value;
        const direccion = document.getElementById("direccion").value.trim();
        const observaciones = document.getElementById("observaciones").value.trim();

        if (!nombre || !telefono) {
            alert("Por favor, completa tu nombre y teléfono.");
            return;
        }

        if (entrega === "domicilio" && !direccion) {
            alert("Por favor, escribe tu dirección.");
            return;
        }

        const total = carrito.reduce(
            (suma, producto) => suma + producto.precio * producto.cantidad,
            0
        );

        let mensaje = `¡Hola! 👋 Quiero realizar un pedido en YOU ONLINE STORE.\n\n`;

        mensaje += `👤 Nombre: ${nombre}\n`;
        mensaje += `📱 Teléfono: ${telefono}\n\n`;
        mensaje += `🛒 MI PEDIDO:\n`;

        carrito.forEach(producto => {
            mensaje += `• ${producto.nombre} x${producto.cantidad} = ${formatoPrecio(producto.precio * producto.cantidad)}\n`;
        });

        mensaje += `\n💰 TOTAL: ${formatoPrecio(total)}\n`;

        mensaje += `\n🚚 Tipo de entrega: ${
            entrega === "domicilio" ? "A domicilio" : "Recoger en tienda"
        }\n`;

        if (entrega === "domicilio") {
            mensaje += `📍 Dirección: ${direccion}\n`;
        }

        if (observaciones) {
            mensaje += `\n📝 Observaciones: ${observaciones}\n`;
        }

        mensaje += `\n¡Gracias!`;

        const enlace = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

        window.open(enlace, "_blank");
    });
}

// Mostrar el carrito al iniciar
mostrarCarrito();

     
