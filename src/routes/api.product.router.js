import { Router } from "express";
import ProductController from "../controllers/product.controller.js";

const ROUTER = Router();
const productController = new ProductController();

ROUTER.post("/", productController.addProduct);
ROUTER.get("/", productController.getProducts);
ROUTER.get("/:id", productController.getProductById);
ROUTER.delete("/:id", productController.deleteProductById);
ROUTER.put("/:id", productController.updateProduct);
ROUTER.put("/available/:id", productController.toggleAvailability);

export default ROUTER;