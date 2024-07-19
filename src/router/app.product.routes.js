import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";

const ROUTER = Router();
const PRODUCT = new ProductManager();

ROUTER.get("/", async (req, res) => {
    try {
        const allProducts = await PRODUCT.getProducts(req.query);
        return res.status(200).render("products", {
            title: "Products",
            products: allProducts,
        });
    } catch (error) {
        res.status(500).send(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

export default ROUTER;