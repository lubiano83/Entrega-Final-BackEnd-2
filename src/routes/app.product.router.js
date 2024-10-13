import { Router } from "express";
import ProductController from "../controllers/product.controller.js";
import CartController from "../controllers/cart.controller.js";

const ROUTER = Router();
const productController = new ProductController();
const cartController = new CartController();

ROUTER.get("/", productController.appGetProducts);
ROUTER.get("/:id", productController.appGetProductById);

ROUTER.post("/:id/add-to-cart", async (req, res) => {
    try {
        const productId = req.params.id;
        const carts = await cartController.getCarts();

        if (carts.length === 0) {
            await cartController.addCart();
            const carts = await cartController.getCarts();
            const firstCartId = carts[0]._id;
            await cartController.addProductToCart(firstCartId, productId);
            return res.redirect(`/carts/${firstCartId}`);
        }

        const firstCartId = carts[0]._id;
        console.log(firstCartId);
        const result = await cartController.addProductToCart(firstCartId, productId);

        if (result === "Producto no encontrado") {
            return res.status(404).json({ status: false, message: result });
        }

        if (result === "Carrito no encontrado") {
            return res.status(404).json({ status: false, message: result });
        }

        return res.redirect(`/carts/${firstCartId}`);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("<h1>Hubo un error en el servidor</h1>");
    }
});

export default ROUTER;