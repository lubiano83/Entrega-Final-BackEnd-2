import { Router } from "express";
import CartController from "../controllers/cart.controller.js";

const ROUTER = Router();
const cartController = new CartController();

ROUTER.post("/", async (req, res) => {
    try {
        res.status(201).send(await cartController.addCart());
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

ROUTER.post("/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        res.status(200).send(await cartController.addProductToCart(cartId, productId));
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

ROUTER.get("/", async (req, res) => {
    try {
        res.status(200).send(await cartController.getCarts());
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

ROUTER.get("/:id", async (req, res) => {
    try {
        const ID = req.params.id;
        res.status(200).send(await cartController.getCartById(ID));
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

ROUTER.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        res.status(200).send(await cartController.deleteProductFromCart(cartId, productId));
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

ROUTER.delete("/:id", async (req, res) => {
    try {
        const ID = req.params.id;
        res.status(200).send(await cartController.deleteCartById(ID));
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

ROUTER.put("/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;

        console.log("cartId:", cartId);
        console.log("productId:", productId);
        console.log("quantity:", quantity);

        if (typeof quantity !== "number") {
            return res.status(400).json({ status: false, message: "Cantidad inválida" });
        }

        const updateResult = await cartController.updateCartQuantity(cartId, productId, quantity);
        console.log("Resultado de la actualización:", updateResult);

        if (updateResult === "Carrito no encontrado" || updateResult === "Producto no encontrado en el carrito" || updateResult === "ID no válido") {
            return res.status(404).json({ status: false, message: updateResult });
        } else if (updateResult === "Error al modificar la cantidad del producto en el carrito") {
            return res.status(500).json({ status: false, message: updateResult });
        } else {
            res.status(200).json({ status: true, message: updateResult });
        }
    } catch (error) {
        console.log("Error en el servidor:", error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

ROUTER.put("/:id", async (req, res) => {
    try {
        const ID = req.params.id;
        const { products } = req.body; // Ahora se espera que el cuerpo de la solicitud contenga un arreglo de productos
        const updateData = { products };
        const cartUpdated = await cartController.updateCart(ID, updateData);
        if (!cartUpdated) {
            return res.status(404).json({ status: false, message: "Producto no encontrado" });
        }
        res.status(200).json({ status: true, payload: cartUpdated });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

export default ROUTER;