import { Router } from "express";
import ProductModel from "../models/product.model.js";

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

ROUTER.get("/admin", async (req, res) => {
    try {
        // Verifica si hay un usuario en la sesión
        const user = req.session.user || null;

        // Renderiza la vista pasando el usuario y el título
        return res.status(200).render("home", { 
            title: "Home", 
            user // Pasar el objeto `user` a la vista
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

ROUTER.get("/", (req, res) => {
    if(req.session.login) {
        return res.redirect("/admin");
    }
    res.render("login");
});

ROUTER.get("/register", (req, res) => {
    if(req.session.login) {
        return res.redirect("/admin");
    }
    res.render("register");
});

ROUTER.get("/profile", (req, res) => {
    if(!req.session.login) {
        return res.redirect("/");
    }
    res.render("profile", { user: req.session.user });
});

export default ROUTER;