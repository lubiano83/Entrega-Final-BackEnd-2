import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";
import CartManager from "../controllers/CartManager.js";

const ROUTER = Router();
const PRODUCT = new ProductManager();
const CART = new CartManager();

ROUTER.get("/", async (req, res) => {
    try {
        const allProducts = await PRODUCT.getProducts(req.query);
        return res.status(200).render("products", { title: "Products", products: allProducts });
    } catch (error) {
        res.status(500).send(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

ROUTER.get("/:id", async (req, res) => {
    try {
        const ID = req.params.id;
        const product = await PRODUCT.getProductById(ID);
        if (!product) {
            return res.status(404).send("<h1>Producto no encontrado</h1>");
        }
        return res.status(200).render("productDetail", { title: "Product Detail", product: product });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("<h1>Hubo un error en el servidor</h1>");
    }
});

ROUTER.post("/:id/add-to-cart", async (req, res) => {
    try {
        const productId = req.params.id;
        const carts = await CART.getCarts();

        if (carts.length === 0) {
            await CART.addCart();
            const carts = await CART.getCarts();
            const firstCartId = carts[0]._id;
            await CART.addProductToCart(firstCartId, productId);
            return res.redirect(`/carts/${firstCartId}`);
        }

        const firstCartId = carts[0]._id;
        console.log(firstCartId);
        const result = await CART.addProductToCart(firstCartId, productId);

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