import { Router } from "express";
import passport from "passport";
import UserController from "../controllers/user.controller.js";

const ROUTER = Router();
const userController = new UserController();

ROUTER.post("/register", userController.registerUser);
ROUTER.post("/login", userController.loginUser);
ROUTER.post("/logout", userController.logoutUser);
ROUTER.get("/current", passport.authenticate("current", { session: false }), userController.currentUser);

export default ROUTER;