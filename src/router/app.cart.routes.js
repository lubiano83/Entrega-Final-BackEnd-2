import { Router } from "express";
import CartManager from "../controllers/CartManager.js";

const ROUTER = Router();
const CART = new CartManager();

ROUTER.get("/", async (req, res) => {
    try {
        const allCarts = await CART.getCarts();
        res.status(200).render("carts", { title: "Carts", carts: allCarts });
    } catch (error) {
        res.status(500).send(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

ROUTER.get("/:id", async (req, res) => {
    try {
        const ID = req.params.id;
        const cart = await CART.getCartById(ID);
        if (!cart) {
            return res.status(404).send("<h1>Carrito no encontrado</h1>");
        }
        return res.status(200).render("cartDetail", { title: "Cart Detail", cart: cart });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("<h1>Hubo un error en el servidor</h1>");
    }
});

export default ROUTER;