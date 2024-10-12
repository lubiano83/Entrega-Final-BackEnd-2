/* Servidor */
import { Server } from "socket.io";
import ProductService from "../services/product.service.js";

const productService = new ProductService();

const CONFIG = (serverHTTP) => {
    const serverIo = new Server(serverHTTP);
    serverIo.on("connection", async (socket) => {
        const id = socket.client.id;
        console.log("Conexion establecida", id);

        try {
            const products = await productService.getProducts();
            socket.emit("products", products.docs);
        } catch (error) {
            console.error("Error al obtener productos:", error);
            socket.emit("productsError", { message: "Error al obtener productos" });
        }

        socket.on("add-product", async (product) => {
            console.log(product);
            try {
                await productController.addProduct({ ...product });
                socket.emit("products", await productService.getProducts());
            } catch (error) {
                console.error("Error al agregar producto:", error);
                socket.emit("productsError", { message: "Error al agregar producto" });
            }
        });

        socket.on("delete-product", async (id) => {
            console.log(id);
            try {
                await productService.deleteProductById(id);
                const updatedProducts = await productService.getProducts();
                socket.emit("products", updatedProducts);
            } catch (error) {
                console.error("Error al eliminar producto:", error);
                socket.emit("productsError", { message: "Error al eliminar producto" });
            }
        });

        socket.on("toggle-availability", async (productId) => {
            try {
                await productService.toggleAvailability(productId);
                const updatedProducts = await productService.getProducts();
                socket.emit("products", updatedProducts);
            } catch (error) {
                console.error("Error al cambiar disponibilidad:", error);
                socket.emit("productsError", { message: "Error al cambiar disponibilidad" });
            }
        });

        socket.on("disconnect", () => {
            console.log("Se desconecto un Cliente");
        });
    });
};

export default { CONFIG };