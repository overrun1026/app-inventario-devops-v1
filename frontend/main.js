"use strict";
const API_URL = "http://localhost:8000";
// ==========================================
// VARIABLES DE EDICIÓN
// ==========================================
let productoEditando = null;
let campoEditando = null;
// ==========================================
// ELEMENTOS DEL HTML
// ==========================================
const btnAgregar = document.getElementById("btnAgregar");
const btnListar = document.getElementById("btnListar");
const panelAgregar = document.getElementById("panelAgregar");
const panelListar = document.getElementById("panelListar");
const productoForm = document.getElementById("productoForm");
const buscarNombre = document.getElementById("buscarNombre");
const buscarId = document.getElementById("buscarId");
const productosContainer = document.getElementById("productosContainer");
// ==========================================
// MODAL
// ==========================================
const editModal = document.getElementById("editModal");
const closeEditModal = document.getElementById("closeEditModal");
const editProductName = document.getElementById("editProductName");
const editProductId = document.getElementById("editProductId");
const editOptions = document.getElementById("editOptions");
const editFieldContainer = document.getElementById("editFieldContainer");
const editFieldLabel = document.getElementById("editFieldLabel");
const editFieldInput = document.getElementById("editFieldInput");
const editFieldTextarea = document.getElementById("editFieldTextarea");
const backToEditOptions = document.getElementById("backToEditOptions");
const cancelEdit = document.getElementById("cancelEdit");
const saveEdit = document.getElementById("saveEdit");
// ==========================================
// CAMBIAR A AGREGAR
// ==========================================
btnAgregar.addEventListener("click", () => {
    panelAgregar.classList.remove("hidden");
    panelListar.classList.add("hidden");
    btnAgregar.classList.add("active");
    btnListar.classList.remove("active");
});
// ==========================================
// CAMBIAR A LISTAR
// ==========================================
btnListar.addEventListener("click", () => {
    panelListar.classList.remove("hidden");
    panelAgregar.classList.add("hidden");
    btnListar.classList.add("active");
    btnAgregar.classList.remove("active");
    cargarProductos();
});
// ==========================================
// LISTAR PRODUCTOS
// ==========================================
async function cargarProductos() {
    try {
        productosContainer.innerHTML = `
            <p class="loading-message">
                Cargando productos...
            </p>
        `;
        const respuesta = await fetch(`${API_URL}/productos`);
        if (!respuesta.ok) {
            throw new Error("Error obteniendo productos");
        }
        const datos = await respuesta.json();
        console.log("Respuesta FastAPI:", datos);
        if (!Array.isArray(datos)) {
            throw new Error("La API no devolvió una lista");
        }
        mostrarProductos(datos);
    }
    catch (error) {
        console.error("Error cargando productos:", error);
        productosContainer.innerHTML = `
            <p class="error-message">
                No se pudieron cargar los productos.
            </p>
        `;
    }
}
// ==========================================
// MOSTRAR PRODUCTOS
// ==========================================
function mostrarProductos(productos) {
    productosContainer.innerHTML = "";
    actualizarContador(productos.length);
    if (productos.length === 0) {
        productosContainer.innerHTML = `
            <div class="empty-message">

                <div class="empty-icon">
                    📦
                </div>

                <h3>
                    No hay productos
                </h3>

                <p>
                    No se encontraron productos.
                </p>

            </div>
        `;
        return;
    }
    productos.forEach((producto) => {
        const card = document.createElement("article");
        card.className =
            "product-card";
        const inicial = producto.nombre
            ? producto.nombre
                .charAt(0)
                .toUpperCase()
            : "?";
        card.innerHTML = `

                <div class="product-main">

                    <div class="product-avatar">
                        ${inicial}
                    </div>

                    <div class="product-info">

                        <h3>
                            ${producto.nombre}
                        </h3>

                        <span class="product-brand">
                            ${producto.marca}
                        </span>

                        <p>
                            ${producto.descripcion}
                        </p>

                    </div>

                </div>


                <div class="product-data">

                    <div>
                        <span>ID</span>

                        <strong>
                            ${producto.id}
                        </strong>
                    </div>


                    <div>
                        <span>COMPRA</span>

                        <strong>
                            $${formatearPrecio(producto.precio_compra)}
                        </strong>
                    </div>


                    <div>
                        <span>VENTA</span>

                        <strong>
                            $${formatearPrecio(producto.precio_venta)}
                        </strong>
                    </div>

                </div>


                <div class="product-actions">

                    <button
                        class="edit-button"
                        data-id="${producto.id}"
                        type="button"
                    >
                        Editar
                    </button>


                    <button
                        class="delete-button"
                        data-id="${producto.id}"
                        type="button"
                    >
                        Eliminar
                    </button>

                </div>

            `;
        productosContainer.appendChild(card);
    });
    conectarBotonesProductos();
}
// ==========================================
// CONTADOR
// ==========================================
function actualizarContador(cantidad) {
    const contador = document.querySelector(".product-count strong");
    if (contador) {
        contador.textContent =
            cantidad.toString();
    }
}
// ==========================================
// FORMATEAR PRECIO
// ==========================================
function formatearPrecio(precio) {
    return Number(precio)
        .toLocaleString("es-CO");
}
// ==========================================
// BOTONES EDITAR / ELIMINAR
// ==========================================
function conectarBotonesProductos() {
    const botonesEditar = document.querySelectorAll(".edit-button");
    botonesEditar.forEach((boton) => {
        boton.addEventListener("click", () => {
            const elemento = boton;
            const idTexto = elemento.dataset.id;
            if (!idTexto) {
                return;
            }
            const id = Number(idTexto);
            abrirEdicion(id);
        });
    });
    const botonesEliminar = document.querySelectorAll(".delete-button");
    botonesEliminar.forEach((boton) => {
        boton.addEventListener("click", () => {
            const elemento = boton;
            const idTexto = elemento.dataset.id;
            if (!idTexto) {
                return;
            }
            const id = Number(idTexto);
            eliminarProducto(id);
        });
    });
}
// ==========================================
// ABRIR EDICIÓN
// ==========================================
async function abrirEdicion(id) {
    try {
        const respuesta = await fetch(`${API_URL}/productos/id/${id}`);
        if (!respuesta.ok) {
            throw new Error("Producto no encontrado");
        }
        const producto = await respuesta.json();
        productoEditando =
            producto;
        editProductName.textContent =
            producto.nombre;
        editProductId.textContent =
            `ID: ${producto.id}`;
        mostrarOpciones();
        editModal.classList.remove("hidden");
    }
    catch (error) {
        console.error(error);
        alert("No se pudo cargar el producto");
    }
}
// ==========================================
// MOSTRAR OPCIONES
// ==========================================
function mostrarOpciones() {
    editOptions.classList.remove("hidden");
    editFieldContainer.classList.add("hidden");
    campoEditando =
        null;
}
// ==========================================
// BOTONES DE CAMPOS
// ==========================================
const botonesCampos = document.querySelectorAll(".edit-option");
botonesCampos.forEach((boton) => {
    boton.addEventListener("click", () => {
        const elemento = boton;
        const campo = elemento.getAttribute("data-field");
        if (!campo) {
            return;
        }
        abrirCampo(campo);
    });
});
// ==========================================
// ABRIR CAMPO
// ==========================================
function abrirCampo(campo) {
    if (!productoEditando) {
        return;
    }
    campoEditando =
        campo;
    editOptions.classList.add("hidden");
    editFieldContainer.classList.remove("hidden");
    editFieldInput.classList.add("hidden");
    editFieldTextarea.classList.add("hidden");
    switch (campo) {
        case "nombre":
            editFieldLabel.textContent =
                "Nuevo nombre";
            editFieldInput.type =
                "text";
            editFieldInput.value =
                productoEditando.nombre;
            editFieldInput.classList.remove("hidden");
            break;
        case "marca":
            editFieldLabel.textContent =
                "Nueva marca";
            editFieldInput.type =
                "text";
            editFieldInput.value =
                productoEditando.marca;
            editFieldInput.classList.remove("hidden");
            break;
        case "descripcion":
            editFieldLabel.textContent =
                "Nueva descripción";
            editFieldTextarea.value =
                productoEditando.descripcion;
            editFieldTextarea.classList.remove("hidden");
            break;
        case "precio_compra":
            editFieldLabel.textContent =
                "Nuevo precio de compra";
            editFieldInput.type =
                "number";
            editFieldInput.value =
                productoEditando
                    .precio_compra
                    .toString();
            editFieldInput.classList.remove("hidden");
            break;
        case "precio_venta":
            editFieldLabel.textContent =
                "Nuevo precio de venta";
            editFieldInput.type =
                "number";
            editFieldInput.value =
                productoEditando
                    .precio_venta
                    .toString();
            editFieldInput.classList.remove("hidden");
            break;
        default:
            mostrarOpciones();
            break;
    }
}
// ==========================================
// VOLVER
// ==========================================
backToEditOptions.addEventListener("click", () => {
    mostrarOpciones();
});
// ==========================================
// CERRAR MODAL
// ==========================================
function cerrarModal() {
    editModal.classList.add("hidden");
    productoEditando =
        null;
    campoEditando =
        null;
}
closeEditModal.addEventListener("click", cerrarModal);
cancelEdit.addEventListener("click", cerrarModal);
// ==========================================
// GUARDAR EDICIÓN
// ==========================================
saveEdit.addEventListener("click", async () => {
    if (!productoEditando ||
        !campoEditando) {
        return;
    }
    let valor;
    if (campoEditando ===
        "descripcion") {
        valor =
            editFieldTextarea
                .value
                .trim();
    }
    else if (campoEditando ===
        "precio_compra" ||
        campoEditando ===
            "precio_venta") {
        valor =
            Number(editFieldInput.value);
    }
    else {
        valor =
            editFieldInput
                .value
                .trim();
    }
    if (typeof valor === "string" &&
        valor === "") {
        alert("El campo no puede estar vacío.");
        return;
    }
    if (typeof valor === "number" &&
        Number.isNaN(valor)) {
        alert("Ingresa un precio válido.");
        return;
    }
    const cambios = {};
    cambios[campoEditando] = valor;
    try {
        const respuesta = await fetch(`${API_URL}/productos/${productoEditando.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cambios)
        });
        const resultado = await respuesta.json();
        if (!respuesta.ok) {
            throw new Error(resultado.detail ||
                "No se pudo actualizar");
        }
        cerrarModal();
        await cargarProductos();
        alert("Producto actualizado correctamente");
    }
    catch (error) {
        console.error("Error actualizando:", error);
        alert("No se pudo actualizar el producto");
    }
});
// ==========================================
// ELIMINAR
// ==========================================
async function eliminarProducto(id) {
    const confirmar = confirm(`¿Seguro que deseas eliminar el producto con ID ${id}?`);
    if (!confirmar) {
        return;
    }
    try {
        const respuesta = await fetch(`${API_URL}/productos/${id}`, {
            method: "DELETE"
        });
        const resultado = await respuesta.json();
        if (!respuesta.ok) {
            throw new Error(resultado.detail ||
                "No se pudo eliminar");
        }
        alert("Producto eliminado correctamente");
        await cargarProductos();
    }
    catch (error) {
        console.error("Error eliminando:", error);
        alert("No se pudo eliminar el producto");
    }
}
// ==========================================
// AGREGAR
// ==========================================
productoForm.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const nombre = document.getElementById("nombre")
        .value
        .trim();
    const marca = document.getElementById("marca")
        .value
        .trim();
    const descripcion = document.getElementById("descripcion")
        .value
        .trim();
    const precioCompra = Number(document.getElementById("precioCompra").value);
    const precioVenta = Number(document.getElementById("precioVenta").value);
    const producto = {
        nombre: nombre,
        marca: marca,
        descripcion: descripcion,
        precio_compra: precioCompra,
        precio_venta: precioVenta
    };
    try {
        const respuesta = await fetch(`${API_URL}/productos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(producto)
        });
        const resultado = await respuesta.json();
        if (!respuesta.ok) {
            throw new Error(resultado.detail ||
                "No se pudo agregar");
        }
        alert("Producto agregado correctamente");
        productoForm.reset();
        btnListar.click();
    }
    catch (error) {
        console.error("Error agregando:", error);
        alert("No se pudo agregar el producto");
    }
});
// ==========================================
// BUSCAR POR NOMBRE
// ==========================================
buscarNombre.addEventListener("input", async () => {
    const nombre = buscarNombre
        .value
        .trim();
    if (nombre === "") {
        cargarProductos();
        return;
    }
    try {
        const respuesta = await fetch(`${API_URL}/productos/nombre/${encodeURIComponent(nombre)}`);
        if (!respuesta.ok) {
            throw new Error("Error buscando");
        }
        const resultado = await respuesta.json();
        if (!Array.isArray(resultado)) {
            mostrarProductos([]);
            return;
        }
        mostrarProductos(resultado);
    }
    catch (error) {
        console.error("Error buscando por nombre:", error);
    }
});
// ==========================================
// BUSCAR POR ID
// ==========================================
buscarId.addEventListener("input", async () => {
    const id = buscarId
        .value
        .trim();
    if (id === "") {
        cargarProductos();
        return;
    }
    try {
        const respuesta = await fetch(`${API_URL}/productos/id/${id}`);
        if (respuesta.status ===
            404) {
            mostrarProductos([]);
            return;
        }
        if (!respuesta.ok) {
            throw new Error("Error buscando producto");
        }
        const producto = await respuesta.json();
        mostrarProductos([
            producto
        ]);
    }
    catch (error) {
        console.error("Error buscando por ID:", error);
    }
});
// ==========================================
// INICIO
// ==========================================
cargarProductos();
const API_URL = "http://localhost:8000";


// ==========================================
// VARIABLES DE EDICIÓN
// ==========================================

let productoEditando = null;
let campoEditando = null;


// ==========================================
// ELEMENTOS DEL HTML
// ==========================================

const btnAgregar =
    document.getElementById("btnAgregar");

const btnListar =
    document.getElementById("btnListar");

const panelAgregar =
    document.getElementById("panelAgregar");

const panelListar =
    document.getElementById("panelListar");

const productoForm =
    document.getElementById("productoForm");

const buscarNombre =
    document.getElementById("buscarNombre");

const buscarId =
    document.getElementById("buscarId");

const productosContainer =
    document.getElementById("productosContainer");


// ==========================================
// MODAL
// ==========================================

const editModal =
    document.getElementById("editModal");

const closeEditModal =
    document.getElementById("closeEditModal");

const editProductName =
    document.getElementById("editProductName");

const editProductId =
    document.getElementById("editProductId");

const editOptions =
    document.getElementById("editOptions");

const editFieldContainer =
    document.getElementById("editFieldContainer");

const editFieldLabel =
    document.getElementById("editFieldLabel");

const editFieldInput =
    document.getElementById("editFieldInput");

const editFieldTextarea =
    document.getElementById("editFieldTextarea");

const backToEditOptions =
    document.getElementById("backToEditOptions");

const cancelEdit =
    document.getElementById("cancelEdit");

const saveEdit =
    document.getElementById("saveEdit");


// ==========================================
// CAMBIAR A AGREGAR
// ==========================================

btnAgregar.addEventListener("click", () => {

    panelAgregar.classList.remove("hidden");

    panelListar.classList.add("hidden");

    btnAgregar.classList.add("active");

    btnListar.classList.remove("active");

});


// ==========================================
// CAMBIAR A LISTAR
// ==========================================

btnListar.addEventListener("click", () => {

    panelListar.classList.remove("hidden");

    panelAgregar.classList.add("hidden");

    btnListar.classList.add("active");

    btnAgregar.classList.remove("active");

    cargarProductos();

});


// ==========================================
// LISTAR PRODUCTOS
// ==========================================

async function cargarProductos() {

    try {

        productosContainer.innerHTML = `
            <p class="loading-message">
                Cargando productos...
            </p>
        `;


        const respuesta =
            await fetch(`${API_URL}/productos`);


        if (!respuesta.ok) {

            throw new Error(
                "Error obteniendo productos"
            );

        }


        const datos =
            await respuesta.json();


        console.log(
            "Respuesta FastAPI:",
            datos
        );


        if (!Array.isArray(datos)) {

            throw new Error(
                "La API no devolvió una lista"
            );

        }


        mostrarProductos(datos);


    } catch (error) {

        console.error(
            "Error cargando productos:",
            error
        );


        productosContainer.innerHTML = `
            <p class="error-message">
                No se pudieron cargar los productos.
            </p>
        `;

    }

}


// ==========================================
// MOSTRAR PRODUCTOS
// ==========================================

function mostrarProductos(productos) {

    productosContainer.innerHTML = "";


    actualizarContador(
        productos.length
    );


    if (productos.length === 0) {

        productosContainer.innerHTML = `
            <div class="empty-message">

                <div class="empty-icon">
                    📦
                </div>

                <h3>
                    No hay productos
                </h3>

                <p>
                    No se encontraron productos.
                </p>

            </div>
        `;

        return;

    }


    productos.forEach(
        (producto) => {

            const card =
                document.createElement("article");


            card.className =
                "product-card";


            const inicial =
                producto.nombre
                    ? producto.nombre
                        .charAt(0)
                        .toUpperCase()
                    : "?";


            card.innerHTML = `

                <div class="product-main">

                    <div class="product-avatar">
                        ${inicial}
                    </div>

                    <div class="product-info">

                        <h3>
                            ${producto.nombre}
                        </h3>

                        <span class="product-brand">
                            ${producto.marca}
                        </span>

                        <p>
                            ${producto.descripcion}
                        </p>

                    </div>

                </div>


                <div class="product-data">

                    <div>
                        <span>ID</span>

                        <strong>
                            ${producto.id}
                        </strong>
                    </div>


                    <div>
                        <span>COMPRA</span>

                        <strong>
                            $${formatearPrecio(
                                producto.precio_compra
                            )}
                        </strong>
                    </div>


                    <div>
                        <span>VENTA</span>

                        <strong>
                            $${formatearPrecio(
                                producto.precio_venta
                            )}
                        </strong>
                    </div>

                </div>


                <div class="product-actions">

                    <button
                        class="edit-button"
                        data-id="${producto.id}"
                        type="button"
                    >
                        Editar
                    </button>


                    <button
                        class="delete-button"
                        data-id="${producto.id}"
                        type="button"
                    >
                        Eliminar
                    </button>

                </div>

            `;


            productosContainer.appendChild(
                card
            );

        }
    );


    conectarBotonesProductos();

}


// ==========================================
// CONTADOR
// ==========================================

function actualizarContador(cantidad) {

    const contador =
        document.querySelector(
            ".product-count strong"
        );


    if (contador) {

        contador.textContent =
            cantidad.toString();

    }

}


// ==========================================
// FORMATEAR PRECIO
// ==========================================

function formatearPrecio(precio) {

    return Number(precio)
        .toLocaleString("es-CO");

}


// ==========================================
// BOTONES EDITAR / ELIMINAR
// ==========================================

function conectarBotonesProductos() {

    const botonesEditar =
        document.querySelectorAll(
            ".edit-button"
        );


    botonesEditar.forEach(
        (boton) => {

            boton.addEventListener(
                "click",
                () => {

                    const idTexto =
                        boton.dataset.id;


                    if (!idTexto) {

                        return;

                    }


                    const id =
                        Number(idTexto);


                    abrirEdicion(id);

                }
            );

        }
    );


    const botonesEliminar =
        document.querySelectorAll(
            ".delete-button"
        );


    botonesEliminar.forEach(
        (boton) => {

            boton.addEventListener(
                "click",
                () => {

                    const idTexto =
                        boton.dataset.id;


                    if (!idTexto) {

                        return;

                    }


                    const id =
                        Number(idTexto);


                    eliminarProducto(id);

                }
            );

        }
    );

}


// ==========================================
// ABRIR EDICIÓN
// ==========================================

async function abrirEdicion(id) {

    try {

        const respuesta =
            await fetch(
                `${API_URL}/productos/id/${id}`
            );


        if (!respuesta.ok) {

            throw new Error(
                "Producto no encontrado"
            );

        }


        const producto =
            await respuesta.json();


        productoEditando =
            producto;


        editProductName.textContent =
            producto.nombre;


        editProductId.textContent =
            `ID: ${producto.id}`;


        mostrarOpciones();


        editModal.classList.remove(
            "hidden"
        );


    } catch (error) {

        console.error(error);


        alert(
            "No se pudo cargar el producto"
        );

    }

}


// ==========================================
// MOSTRAR OPCIONES
// ==========================================

function mostrarOpciones() {

    editOptions.classList.remove(
        "hidden"
    );


    editFieldContainer.classList.add(
        "hidden"
    );


    campoEditando =
        null;

}


// ==========================================
// BOTONES DE CAMPOS
// ==========================================

const botonesCampos =
    document.querySelectorAll(
        ".edit-option"
    );


botonesCampos.forEach(
    (boton) => {

        boton.addEventListener(
            "click",
            () => {

                const campo =
                    boton.getAttribute(
                        "data-field"
                    );


                if (!campo) {

                    return;

                }


                abrirCampo(
                    campo
                );

            }
        );

    }
);


// ==========================================
// ABRIR CAMPO
// ==========================================

function abrirCampo(campo) {

    if (!productoEditando) {

        return;

    }


    campoEditando =
        campo;


    editOptions.classList.add(
        "hidden"
    );


    editFieldContainer.classList.remove(
        "hidden"
    );


    editFieldInput.classList.add(
        "hidden"
    );


    editFieldTextarea.classList.add(
        "hidden"
    );


    switch (campo) {

        case "nombre":

            editFieldLabel.textContent =
                "Nuevo nombre";


            editFieldInput.type =
                "text";


            editFieldInput.value =
                productoEditando.nombre;


            editFieldInput.classList.remove(
                "hidden"
            );

            break;


        case "marca":

            editFieldLabel.textContent =
                "Nueva marca";


            editFieldInput.type =
                "text";


            editFieldInput.value =
                productoEditando.marca;


            editFieldInput.classList.remove(
                "hidden"
            );

            break;


        case "descripcion":

            editFieldLabel.textContent =
                "Nueva descripción";


            editFieldTextarea.value =
                productoEditando.descripcion;


            editFieldTextarea.classList.remove(
                "hidden"
            );

            break;


        case "precio_compra":

            editFieldLabel.textContent =
                "Nuevo precio de compra";


            editFieldInput.type =
                "number";


            editFieldInput.value =
                productoEditando
                    .precio_compra
                    .toString();


            editFieldInput.classList.remove(
                "hidden"
            );

            break;


        case "precio_venta":

            editFieldLabel.textContent =
                "Nuevo precio de venta";


            editFieldInput.type =
                "number";


            editFieldInput.value =
                productoEditando
                    .precio_venta
                    .toString();


            editFieldInput.classList.remove(
                "hidden"
            );

            break;


        default:

            mostrarOpciones();

            break;

    }

}


// ==========================================
// VOLVER
// ==========================================

backToEditOptions.addEventListener(
    "click",
    () => {

        mostrarOpciones();

    }
);


// ==========================================
// CERRAR MODAL
// ==========================================

function cerrarModal() {

    editModal.classList.add(
        "hidden"
    );


    productoEditando =
        null;


    campoEditando =
        null;

}


closeEditModal.addEventListener(
    "click",
    cerrarModal
);


cancelEdit.addEventListener(
    "click",
    cerrarModal
);


// ==========================================
// GUARDAR EDICIÓN
// ==========================================

saveEdit.addEventListener(
    "click",
    async () => {

        if (
            !productoEditando ||
            !campoEditando
        ) {

            return;

        }


        let valor;


        if (
            campoEditando ===
            "descripcion"
        ) {

            valor =
                editFieldTextarea
                    .value
                    .trim();

        }

        else if (
            campoEditando ===
            "precio_compra" ||
            campoEditando ===
            "precio_venta"
        ) {

            valor =
                Number(
                    editFieldInput.value
                );

        }

        else {

            valor =
                editFieldInput
                    .value
                    .trim();

        }


        if (
            typeof valor === "string" &&
            valor === ""
        ) {

            alert(
                "El campo no puede estar vacío."
            );

            return;

        }


        if (
            typeof valor === "number" &&
            Number.isNaN(valor)
        ) {

            alert(
                "Ingresa un precio válido."
            );

            return;

        }


        const cambios = {};


        cambios[
            campoEditando
        ] = valor;


        try {

            const respuesta =
                await fetch(
                    `${API_URL}/productos/${productoEditando.id}`,
                    {

                        method: "PATCH",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                cambios
                            )

                    }
                );


            const resultado =
                await respuesta.json();


            if (!respuesta.ok) {

                throw new Error(
                    resultado.detail ||
                    "No se pudo actualizar"
                );

            }


            cerrarModal();


            await cargarProductos();


            alert(
                "Producto actualizado correctamente"
            );


        } catch (error) {

            console.error(
                "Error actualizando:",
                error
            );


            alert(
                "No se pudo actualizar el producto"
            );

        }

    }
);


// ==========================================
// ELIMINAR
// ==========================================

async function eliminarProducto(id) {

    const confirmar =
        confirm(
            `¿Seguro que deseas eliminar el producto con ID ${id}?`
        );


    if (!confirmar) {

        return;

    }


    try {

        const respuesta =
            await fetch(
                `${API_URL}/productos/${id}`,
                {
                    method: "DELETE"
                }
            );


        const resultado =
            await respuesta.json();


        if (!respuesta.ok) {

            throw new Error(
                resultado.detail ||
                "No se pudo eliminar"
            );

        }


        alert(
            "Producto eliminado correctamente"
        );


        await cargarProductos();


    } catch (error) {

        console.error(
            "Error eliminando:",
            error
        );


        alert(
            "No se pudo eliminar el producto"
        );

    }

}


// ==========================================
// AGREGAR
// ==========================================

productoForm.addEventListener(
    "submit",
    async (evento) => {

        evento.preventDefault();


        const nombre =
            document.getElementById(
                "nombre"
            )
            .value
            .trim();


        const marca =
            document.getElementById(
                "marca"
            )
            .value
            .trim();


        const descripcion =
            document.getElementById(
                "descripcion"
            )
            .value
            .trim();


        const precioCompra =
            Number(
                document.getElementById(
                    "precioCompra"
                ).value
            );


        const precioVenta =
            Number(
                document.getElementById(
                    "precioVenta"
                ).value
            );


        const producto = {

            nombre:
                nombre,

            marca:
                marca,

            descripcion:
                descripcion,

            precio_compra:
                precioCompra,

            precio_venta:
                precioVenta

        };


        try {

            const respuesta =
                await fetch(
                    `${API_URL}/productos`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                producto
                            )

                    }
                );


            const resultado =
                await respuesta.json();


            if (!respuesta.ok) {

                throw new Error(
                    resultado.detail ||
                    "No se pudo agregar"
                );

            }


            alert(
                "Producto agregado correctamente"
            );


            productoForm.reset();


            btnListar.click();


        } catch (error) {

            console.error(
                "Error agregando producto:",
                error
            );


            alert(
                "No se pudo agregar el producto"
            );

        }

    }
);


// ==========================================
// BUSCAR POR NOMBRE
// ==========================================

buscarNombre.addEventListener(
    "input",
    async () => {

        const nombre =
            buscarNombre
                .value
                .trim();


        if (nombre === "") {

            cargarProductos();

            return;

        }


        try {

            const respuesta =
                await fetch(
                    `${API_URL}/productos/nombre/${encodeURIComponent(nombre)}`
                );


            if (!respuesta.ok) {

                throw new Error(
                    "Error buscando"
                );

            }


            const resultado =
                await respuesta.json();


            if (!Array.isArray(resultado)) {

                mostrarProductos([]);

                return;

            }


            mostrarProductos(
                resultado
            );


        } catch (error) {

            console.error(
                "Error buscando por nombre:",
                error
            );

        }

    }
);


// ==========================================
// BUSCAR POR ID
// ==========================================

buscarId.addEventListener(
    "input",
    async () => {

        const id =
            buscarId
                .value
                .trim();


        if (id === "") {

            cargarProductos();

            return;

        }


        try {

            const respuesta =
                await fetch(
                    `${API_URL}/productos/id/${id}`
                );


            if (
                respuesta.status ===
                404
            ) {

                mostrarProductos([]);

                return;

            }


            if (!respuesta.ok) {

                throw new Error(
                    "Error buscando producto"
                );

            }


            const producto =
                await respuesta.json();


            mostrarProductos([
                producto
            ]);


        } catch (error) {

            console.error(
                "Error buscando por ID:",
                error
            );

        }

    }
);


// ==========================================
// INICIO
// ==========================================

cargarProductos();