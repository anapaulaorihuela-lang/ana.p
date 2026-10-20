
// Funciones del supermercado virtual
// ======================================

// 1. CREAR EL CARRITO DE COMPRAS

let carrito = [];


// 2. BUSCAR LOS ELEMENTOS DE LA PAGINA

const botonesAgregar = document.querySelectorAll(
    "article button"
);

const seccionCarrito = document.getElementById("carrito");


// 3. AGREGAR PRODUCTOS AL CARRITO

botonesAgregar.forEach(function(boton) {

    boton.addEventListener("click", function() {

        const tarjeta = boton.closest("article");

        const nombre = tarjeta.querySelector("h3, h4").textContent;

        const parrafoPrecio = Array.from(
            tarjeta.querySelectorAll("p")
        ).find(function(p) {
            return p.textContent.includes("Precio:");
        });

        if (!parrafoPrecio) {
            alert("No se encontró el precio del producto.");
            return;
        }

        const textoPrecio = parrafoPrecio.textContent;

        const coincidencia = textoPrecio.match(
            /Bs\.\s*([\d]+(?:[.,]\d+)?)/i
        );

        if (!coincidencia) {
            alert("El precio de este producto no es válido.");
            return;
        }

        const precio = Number(
            coincidencia[1].replace(",", ".")
        );

        const productoExistente = carrito.find(function(producto) {
            return producto.nombre === nombre;
        });

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

        alert(nombre + " se agregó al carrito.");

    });

});


// 4. MOSTRAR LOS PRODUCTOS DEL CARRITO

function mostrarCarrito() {

    const productos = seccionCarrito.querySelector("p");

    seccionCarrito.innerHTML = `
        <h2>🛒 MI CARRITO DE COMPRAS</h2>
    `;

    if (carrito.length === 0) {

        seccionCarrito.innerHTML += `
            <p>Tu carrito está vacío.</p>
        `;

    } else {

        carrito.forEach(function(producto, indice) {

            const subtotal = producto.precio * producto.cantidad;

            seccionCarrito.innerHTML += `
                <article>
                    <h3>${producto.nombre}</h3>

                    <p>Precio unitario: Bs. ${producto.precio.toFixed(2)}</p>

                    <p>
                        Cantidad: ${producto.cantidad}
                    </p>

                    <p>
                        Subtotal: Bs. ${subtotal.toFixed(2)}
                    </p>

                    <button
                        type="button"
                        onclick="cambiarCantidad(${indice}, -1)">
                        ➖
                    </button>

                    <button
                        type="button"
                        onclick="cambiarCantidad(${indice}, 1)">
                        ➕
                    </button>

                    <button
                        type="button"
                        onclick="eliminarProducto(${indice})">
                        Eliminar
                    </button>
                </article>
            `;

        });

    }

    const total = carrito.reduce(function(suma, producto) {
        return suma + producto.precio * producto.cantidad;
    }, 0);

    seccionCarrito.innerHTML += `
        <h3>Total de la compra: Bs. ${total.toFixed(2)}</h3>

        <button type="button" onclick="vaciarCarrito()">
            Vaciar carrito
        </button>

        <button type="button" onclick="irAlPedido()">
            Continuar con el pedido
        </button>
    `;

}


// 5. AUMENTAR O DISMINUIR CANTIDADES

function cambiarCantidad(indice, cambio) {

    carrito[indice].cantidad += cambio;

    if (carrito[indice].cantidad <= 0) {

        carrito.splice(indice, 1);

    }

    mostrarCarrito();

}


// 6. ELIMINAR UN PRODUCTO

function eliminarProducto(indice) {

    carrito.splice(indice, 1);

    mostrarCarrito();

}


// 7. VACIAR TODO EL CARRITO

function vaciarCarrito() {

    carrito = [];

    mostrarCarrito();

}


// 8. IR AL FORMULARIO DEL PEDIDO

function irAlPedido() {

    if (carrito.length === 0) {

        alert("Primero agrega productos a tu carrito.");

        return;

    }

    const lista = document.getElementById("lista");

    if (lista) {

        lista.value = carrito.map(function(producto) {

            return producto.nombre +
                " x " + producto.cantidad +
                " = Bs. " +
                (producto.precio * producto.cantidad).toFixed(2);

        }).join("\n");

    }

    document.getElementById("pedido").scrollIntoView({
        behavior: "smooth"
    });

}


// 9. VALIDAR EL FORMULARIO

const formulario = document.querySelector("#pedido form");

formulario.addEventListener("submit", function(evento) {

    evento.preventDefault();

    if (carrito.length === 0) {

        alert("Agrega productos al carrito antes de enviar el pedido.");

        return;

    }

    const nombre = document.getElementById("nombre").value.trim();

    const telefono = document.getElementById("telefono").value.trim();

    const entrega = document.getElementById("entrega").value;

    const direccion = document.getElementById("direccion").value.trim();

    if (!nombre || !telefono || !entrega) {

        alert("Por favor, completa los campos obligatorios.");

        return;

    }

    if (entrega === "domicilio" && !direccion) {

        alert("Escribe tu dirección para la entrega a domicilio.");

        return;

    }

    const total = carrito.reduce(function(suma, producto) {

        return suma + producto.precio * producto.cantidad;

    }, 0);

    alert(
        "¡Pedido preparado correctamente!\n\n" +
        "Cliente: " + nombre + "\n" +
        "Celular: " + telefono + "\n" +
        "Entrega: " +
        (entrega === "tienda" ? "Recoger en tienda" : "A domicilio") +
        "\nTotal: Bs. " + total.toFixed(2) +
        "\n\nPara confirmar tu compra, comunícate con la tienda."
    );

});


// 10. MOSTRAR EL CARRITO VACÍO AL INICIAR

mostrarCarrito();

console.log("You Online Store está listo.");
```