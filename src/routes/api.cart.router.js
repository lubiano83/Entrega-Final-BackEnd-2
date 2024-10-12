import { Router } from "express";
import CartController from "../controllers/cart.controller.js";

const ROUTER = Router();
const cartController = new CartController();

ROUTER.get("/", cartController.getCarts);
ROUTER.post("/", cartController.addCart);
ROUTER.get("/:id", cartController.getCartById);
ROUTER.delete("/:id", cartController.deleteCartById);
ROUTER.put("/:id", cartController.updateCart);
ROUTER.post("/:cid/products/:pid", cartController.addProductToCart);
ROUTER.delete("/:cid/products/:pid", cartController.deleteProductFromCart);
ROUTER.put("/:cid/products/:pid", cartController.updateCartQuantity);
ROUTER.delete("/clean/:cid", cartController.clearCart);

export default ROUTER;