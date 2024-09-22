import { Router } from "express";
import UserModel from "../models/user.model.js";
import passport from "passport";

const ROUTER = Router();

// Register version para passport
ROUTER.post("/register", passport.authenticate("register", {failureRedirect: "/api/sessions/failregister"}), async (req, res) => {
    
    if(!req.user) {
        return res.send("Credenciales invalidas..");
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        rol: req.user.rol,
    }

    req.session.login = true;
    res.redirect("/admin");
});

ROUTER.get("/failregister", (req, res) => {
    res.send("¡Fallo el registro de usuario!");
});

// Login version para passport
ROUTER.post("/login", passport.authenticate("login", {failureRedirect: "/api/sessions/faillogin"}), async(req, res) => {
    if(!req.user) {
        return res.send("Credenciales invalidas..");
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        rol: req.user.rol,
    }

    req.session.login = true;
    res.redirect("/admin");
});

ROUTER.get("/faillogin", (req, res) => {
    res.send("¡Fallo el login de usuario!");
});

// Logout
ROUTER.get("/logout", (req, res) => {
    try {
        if (req.session.login) {
            req.session.destroy();
        }
        res.redirect("/");
    } catch (error) {
        console.log("logout", error.message);
    }
});

// Version para GitHub
ROUTER.get("/github", passport.authenticate("github", {scope: ["user: email"]}), (req, res) => {});

ROUTER.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async(req, res) => {
    // La estrategia de github nos retornara el usuario, entonces lo agregamos a nuestro objeto de session.
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/profile");
});

export default ROUTER;