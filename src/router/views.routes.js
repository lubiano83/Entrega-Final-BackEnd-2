import { Router } from "express";
import ProductModel from "../models/product.model.js";
import passport from "passport";

const ROUTER = Router();

ROUTER.get("/explain", async (req, res) => {
    try {
        const result = await ProductModel.find({ $and: [{ category: "BATERIA" }, { title: "55457" }] }).explain();
        console.log(result.executionStats);
        res.status(200).json({ status: true, payload: result.executionStats });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

ROUTER.get("/realtimeproducts", async (req, res) => {
    try {
        return res.status(200).render("realTimeProducts", { title: "realTimeProducts" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

ROUTER.get("/", (req, res) => {
    if (req.cookies.coderCookieToken) {
        return res.redirect("/api/sessions/current");
    }
    res.render("login");
});

ROUTER.get("/register", (req, res) => {
    if (req.cookies.coderCookieToken) {
        return res.redirect("/api/sessions/current");
    }
    res.render("register");
});

ROUTER.get("/profile", passport.authenticate("current", { session: false }), (req, res) => {
    res.render("profile", { user: req.user });
});

export default ROUTER;