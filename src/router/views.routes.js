import { Router } from "express";
import ProductModel from "../models/product.model.js";
import { authorization, passportCall } from "../utils/util.js";
import UserModel from "../models/user.model.js";

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

ROUTER.get("/admin", authorization("admin"), async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).lean();

        if (!user) {
            return res.status(404).send("Usuario no encontrado.");
        }

        // Renderizar la vista si el usuario tiene acceso
        return res.status(200).render("home", { title: "Home", user });
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

// Enrutador de perfil
ROUTER.get("/profile", passportCall("jwt"), async (req, res) => {
    console.log("Request to /profile received");
    console.log("User:", req.user);

    if (!req.user) {
        return res.status(401).send("No autorizado.");
    }

    try {
        // Buscar el usuario en la base de datos por ID
        const user = await UserModel.findById(req.user.id).lean();

        if (!user) {
            return res.status(404).send("Usuario no encontrado.");
        }

        // Renderizar la vista del perfil con los datos del usuario
        res.render("profile", { user: { ...user, id: user._id.toString() } });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).send("Error al obtener los datos del usuario.");
    }
});

export default ROUTER;