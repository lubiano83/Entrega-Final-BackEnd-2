import { Router } from "express";
import CartController from "../controllers/cart.controller.js";

const ROUTER = Router();
const cartController = new CartController();

ROUTER.get("/", cartController.appGetCarts);
ROUTER.get("/:id", cartController.appGetCartById);
ROUTER.post("/:id/clear", cartController.appClearCart);

export default ROUTER;