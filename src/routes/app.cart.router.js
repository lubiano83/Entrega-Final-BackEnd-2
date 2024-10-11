import { Router } from "express";
import CartController from "../controllers/cart.controller.js";

const ROUTER = Router();
const cartController = new CartController();

ROUTER.get("/", async (req, res) => {
    try {
        const allCarts = await cartController.getCarts();
        if (!allCarts) {
            return res.status(404).send("<h1>Carritos no encontrados</h1>");
        }
        res.status(200).render("carts", { title: "Carts", carts: allCarts });
    } catch (error) {
        res.status(500).send(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

ROUTER.get("/:id", async (req, res) => {
    try {
        const ID = req.params.id;
        const cart = await cartController.getCartById(ID);
        if (!cart) {
            return res.status(404).send("<h1>Carrito no encontrado</h1>");
        }
        res.status(200).render("cartDetail", { title: "Cart Detail", cart: cart });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("<h1>Hubo un error en el servidor</h1>");
    }
});

ROUTER.post("/:id/clear", async (req, res) => {
    try {
        const ID = req.params.id;
        const result = await cartController.clearCart(ID); // Usa el método clearCart
        if (result === false) {
            return res.status(404).send("<h1>Carrito no encontrado</h1>");
        } else if (result === "Error al eliminar los productos del carrito") {
            return res.status(500).send("<h1>Error al eliminar los productos del carrito</h1>");
        }
        res.status(200).redirect(`/carts/${ID}`);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("<h1>Hubo un error en el servidor</h1>");
    }
});

export default ROUTER;