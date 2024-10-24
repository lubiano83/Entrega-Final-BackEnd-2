import CartService from "../services/cart.service.js";
import ProductService from "../services/product.service.js";
import TicketModel from "../models/ticket.model.js";
import { respuesta } from "../utils/reutilizable.js";

const cartService = new CartService();
const productService = new ProductService();

export default class CartController {

    getCarts = async (req, res) => {
        try {
            const carts = await cartService.getCarts();
            return res.status(200).json(carts);
        } catch (error) {
            respuesta(res, 500, "Hubo un error al obtener los carritos..");
        }
    };

    addCart = async (req, res) => {
        try {
            const cart = await cartService.addCart();
            return res.status(200).json(cart);
        } catch (error) {
            respuesta(res, 500, "Hubo un error al agregar un carrito..");
        }
    };

    getCartById = async (req, res) => {
        const { id } = req.params;
        try {
            const cart = await cartService.getCartById(id);
            if(!cart){
                return "Not found";
            }
            return res.status(200).json(cart);
        } catch (error) {
            respuesta(res, 500, "Hubo un error al obtener el carrito..");
        }
    };

    deleteCartById = async (req, res) => {
        const { id } = req.params;
        try {
            const cart = await cartService.deleteCartById(id);

            if (!cart) {
                return "Carrito no encontrado";
            }
            return res.status(200).json({ message: "Carrito eliminado con exito" });
        } catch (error) {
            respuesta(res, 500, "Hubo un error al eliminar el carrito..");
        }
    };

    updateCart = async (req, res) => {
        const { id } = req.params;
        const { products } = req.body;

        try {
            const cart = await cartService.updateCart(id, { products });
            if (cart === null) {
                return res.status(404).json({ status: false, message: "Carrito no encontrado" });
            }
            if (typeof cart === "string") {
                return res.status(404).json({ status: false, message: cart }); // Maneja el mensaje de error de ID
            }

            return res.status(200).json({ status: true, payload: cart });
        } catch (error) {
            respuesta(res, 500, "Hubo un error al editar el carrito..");
        }
    };

    addProductToCart = async (req, res) => {
        const { cid: cartId, pid: productId } = req.params;

        if (!cartId || !productId) {
            return res.status(400).json({ message: "Carrito o producto no encontrado" });
        }

        try {
            const message = await cartService.addProductToCart(cartId, productId);
            return res.status(200).json({ message });
        } catch (error) {
            respuesta(res, 500, "Hubo un error al agregar un producto al carrito..");
        }
    };

    deleteProductFromCart = async (req, res) => {
        const { cid: cartId, pid: productId } = req.params;

        if (!cartId || !productId) {
            return res.status(400).json({ message: "Carrito o producto no encontrado" });
        }

        try {
            const result = await cartService.deleteProductFromCart(cartId, productId);

            if (typeof result === "string") {
                return res.status(404).json({ message: result });
            }

            return res.status(200).json({
                message: "Producto eliminado con éxito",
                updatedCart: result,
            });
        } catch (error) {
            respuesta(res, 500, "Hubo un error al eliminar un producto del carrito..");
        }
    };

    updateCartQuantity = async (req, res) => {
        const { cid: cartId, pid: productId } = req.params;

        if (!cartId || !productId) {
            return res.status(400).json({ message: "Carrito o producto no encontrado" });
        }

        const { quantity } = req.body;
        if (quantity === undefined || quantity <= 0) {
            return res.status(400).json({ message: "Necesitas colocar una cantidad válida." });
        }

        try {
            const result = await cartService.updateCartQuantity(cartId, productId, quantity); // Llama al servicio

            if (typeof result === "string") {
                return res.status(404).json({ message: result });
            }

            return res.status(200).json({
                message: "Cantidad de producto modificada",
                updatedCart: result,
            });
        } catch (error) {
            respuesta(res, 500, "Hubo un error al actualizar la cantidad..");
        }
    };

    clearCart = async (req, res) => {
        const { cid } = req.params;

        if (!cid) {
            return res.status(400).json({ message: "ID del carrito no proporcionado" });
        }

        try {
            const cart = await cartService.clearCart(cid);

            if (!cart) {
                return res.status(404).json({ message: "Carrito no encontrado" });
            }

            return res.status(200).json({
                message: "Carrito limpiado exitosamente",
                updatedCart: cart,
            });
        } catch (error) {
            respuesta(res, 500, "Hubo un error al limpiar el carrito..");
        }
    };

    appGetCarts = async(req, res) => {
        try {
            const carts = await cartService.getCarts();
            res.status(200).render("carts", { title: "Carts", carts });
        } catch (error) {
            respuesta(res, 500, "Hubo un error al obtener los carritos..");
        }
    };

    appGetCartById = async(req, res) => {
        const { id } = req.params;
        try {
            const cart = await cartService.getCartById(id);
            if (!cart) {
                return res.status(404).send("<h1>Carrito no encontrado</h1>");
            }
            res.status(200).render("cartDetail", { title: "Cart Detail", cart: cart });
        } catch (error) {
            respuesta(res, 500, "Hubo un error al obtener el carrito..");
        }
    };

    appClearCart = async(req, res) => {
        const { id } = req.params;
        try {
            const result = await cartService.clearCart(id);
            if (result === false) {
                return res.status(404).send("<h1>Carrito no encontrado</h1>");
            } else if (result === "Error al eliminar los productos del carrito") {
                return res.status(500).send("<h1>Error al eliminar los productos del carrito</h1>");
            }
            res.status(200).redirect(`/carts/${id}`);
        } catch (error) {
            respuesta(res, 500, "Hubo un error al limpiar el carrito..");
        }
    };

    completePurchase = async (req, res) => {
        const cartId = req.user.cart;
        const userId = req.user.id;
        try {
            const cart = await cartService.getCartById(cartId);
            if (!cart || cart.products.length === 0) {
                return res.status(400).json({ message: "El carrito está vacío o no existe." });
            }

            let total = 0;
            const productsPartialSold = [];
            const remainingProducts = [];

            for (const product of cart.products) {
                const stockAvailable = product.id.stock;
                const quantityRequested = product.quantity;

                if (quantityRequested > stockAvailable) {
                    total += product.id.price * stockAvailable;

                    productsPartialSold.push({
                        productId: product.id._id,
                        title: product.id.title,
                        requestedQuantity: quantityRequested,
                        soldQuantity: stockAvailable,
                        remainingQuantity: quantityRequested - stockAvailable,
                    });

                    remainingProducts.push({
                        id: product.id._id,
                        quantity: quantityRequested - stockAvailable,
                    });

                    await productService.updateProduct(product.id._id, { stock: 0 });
                } else {
                    total += product.id.price * quantityRequested;
                    const stockToUpdate = stockAvailable - quantityRequested;
                    await productService.updateProduct(product.id._id, { stock: stockToUpdate });
                }
            }

            if (remainingProducts.length > 0) {
                await cartService.updateCart(cartId, { products: remainingProducts });
            } else {
                await cartService.clearCart(cartId);
            }

            const ticket = new TicketModel({
                amount: total,
                purchaser: userId,
            });

            await ticket.save();

            return res.status(200).json({
                message: "Compra completada con éxito",
                totalAmount: total,
                partiallySoldProducts: productsPartialSold,
                cart: remainingProducts.length > 0 ? remainingProducts : [],
                ticket,
            });

        } catch (error) {
            console.error("Error en completePurchase:", error);
            return res.status(500).json({ message: "Hubo un error al completar la compra." });
        }
    };
}