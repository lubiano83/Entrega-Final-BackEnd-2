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

export default ROUTER;