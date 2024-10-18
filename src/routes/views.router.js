import { Router } from "express";
import passport from "passport";
import ProductController from "../controllers/product.controller.js";
import UserController from "../controllers/user.controller.js";
import { soloAdmin } from "../middlewares/auth.middleware.js";

const ROUTER = Router();
const productController = new ProductController();
const userController = new UserController();
const permissions = passport.authenticate("current", { session: false });

ROUTER.get("/explain", permissions, soloAdmin, productController.explain);
ROUTER.get("/realtimeproducts", permissions, soloAdmin, productController.realTimeProducts);
ROUTER.get("/", userController.renderLogin);
ROUTER.get("/register", userController.renderRegister);
ROUTER.get("/profile", permissions, userController.renderProfile);

export default ROUTER;