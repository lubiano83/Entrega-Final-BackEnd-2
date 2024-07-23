/* Cliente */
console.log("Hola desde el server");

const SOCKET = io();
const FORM = document.getElementById("form");

// esto es para escuchar un mensaje
SOCKET.on("connect", () => {
    console.log("Conectado al Server");
});

// esto es para escuchar un mensaje
SOCKET.on("products", (products) => {
    const TBODY = document.getElementById("tbody");
    TBODY.innerHTML = ""; // Limpiar contenido anterior

    let rowsHTML = ""; // Variable para acumular todas las filas

    // Verificar que products.docs sea un array válido
    if (products && products.productsFound && Array.isArray(products.productsFound.docs)) {
        products.productsFound.docs.forEach((product) => {
            const availabilityIcon = product.available
                ? '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" color="green" class="bi bi-check2 available" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/></svg>'
                : '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" color="red" class="bi bi-x-lg available" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>';

            rowsHTML += `
                <tr class="categories__item">
                    <td class="code update" id="${product._id}">${product.code}</td>
                    <td class="category update" id="${product._id}">${product.category}</td>
                    <td class="title update" id="${product._id}">${product.title}</td>
                    <td class="thumbnail update" id="${product._id}"><a href="${product.thumbnail[0]}" target="_blank">${product.thumbnail[0]}</a></td>
                    <td class="price update" id="${product._id}">${product.price}</td>
                    <td class="stock update" id="${product._id}">${product.stock}</td>
                    <td><a class="available" id="${product._id}">${availabilityIcon}</a></td>
                    <td>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" color="blue" class="bi bi-pencil-square edit" id="${product._id}" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                        </svg>
                    </a></td>
                    <td><a>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" color="red" class="bi bi-trash3 delete" id="${product._id}" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                        </svg>
                    </a></td>
                </tr>
            `;
        });
    } else {
        console.log("Received products is null or not an array", products);
    }

    // Establecer el contenido HTML una vez construido
    TBODY.innerHTML = rowsHTML;

    // Configurar event listeners para los botones de editar y eliminar
    document.querySelectorAll(".delete").forEach((button) => {
        button.addEventListener("click", function() {
            const productId = this.getAttribute("id");
            SOCKET.emit("delete-product", productId);
        });
    });

    document.querySelectorAll(".available").forEach((button) => {
        button.addEventListener("click", function() {
            const productId = this.getAttribute("id");
            SOCKET.emit("toggle-availability", productId);
        });
    });
});

FORM.addEventListener("submit", function(event) {
    event.preventDefault();
    // obtener valores del formulario
    const FILE = document.getElementById("file").value;
    const CODE = document.getElementById("code").value;
    const CATEGORY = document.getElementById("category").value;
    const TITLE = document.getElementById("title").value;
    const PRICE = document.getElementById("price").value;
    const STOCK = document.getElementById("stock").value;
    const DESCRIPTION = document.getElementById("description").value;
    // enviar el nuevo producto al servidor a traves de socket
    const product = {
        code: CODE,
        category: CATEGORY,
        title: TITLE,
        description: DESCRIPTION,
        price: Number(PRICE),
        stock: Number(STOCK),
        thumbnail: [FILE],
        available: true,
    };
    console.log(FILE);
    SOCKET.emit("add-product", product);
    FORM.reset();
});

// esto aparece al desconectar el servidor (control+C).
SOCKET.on("disconnect", () => {
    console.log("Se desconecto el server");
});