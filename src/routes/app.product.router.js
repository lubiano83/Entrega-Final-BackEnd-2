import { Router } from "express";
import ProductController from "../controllers/product.controller.js";

const ROUTER = Router();
const productController = new ProductController();

ROUTER.get("/", productController.appGetProducts);
ROUTER.get("/:id", productController.appGetProductById);
ROUTER.post("/:id/add-to-cart", productController.appAddProductToCart);

export default ROUTER;