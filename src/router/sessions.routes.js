import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { authorization, passportCall } from "../utils/util.js";

const ROUTER = Router();

// Register version para passport
ROUTER.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/failregister" }), async (req, res) => {

    if(!req.user) {
        return res.send("Credenciales invalidas..");
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        rol: req.user.rol || "usuario",
    };

    req.session.login = true;
    res.redirect("/admin");
});

ROUTER.get("/failregister", (req, res) => {
    res.send("¡Fallo el registro de usuario!");
});

// Login version para jwt
ROUTER.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin" }), async (req, res) => {
    if (!req.user) {
        return res.status(401).send("Credenciales inválidas.");
    }

    // Generar el token JWT usando la información del usuario
    const token = jwt.sign(
        { id: req.user._id, role: req.user.rol, age: req.user.age },
        "coderhouse", // Clave secreta para firmar el token (guárdala en las variables de entorno)
        { expiresIn: "1h" }, // El token expira en 1 hora
    );

    // Enviar el token como una cookie
    res.cookie("coderCookieToken", token, {
        httpOnly: true, // Para que no sea accesible desde JavaScript del lado del cliente
        secure: false, // Solo se envía en solicitudes HTTPS (importante en producción)
        sameSite: "strict", // Evita que se envíe en solicitudes cross-site
    });

    res.redirect("/admin");
});

ROUTER.get("/faillogin", (req, res) => {
    res.send("¡Fallo el login de usuario!");
});

ROUTER.get("/profile", passportCall("jwt"), async (req, res) => {
    console.log("User in profile:", req.user); // Verifica qué usuario está siendo retornado
    if (!req.user) {
        return res.status(401).send("No autorizado.");
    }
    res.send("Bienvenido a tu perfil, " + req.user.first_name);
});

// Logout
ROUTER.get("/logout", (req, res) => {
    try {
        if(req.session.login) {
            req.session.destroy();
        }
        res.redirect("/");
    } catch (error) {
        console.log("logout", error.message);
    }
});

// Version para GitHub
ROUTER.get("/github", passport.authenticate("github", { scope: ["user: email"] }), (req, res) => {});

ROUTER.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async(req, res) => {
    // La estrategia de github nos retornara el usuario, entonces lo agregamos a nuestro objeto de session.
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/admin");
});

// Version para Google
ROUTER.get("/google", passport.authenticate("google", { scope: [ "profile", "email" ] }), async(req, res) => {
    // No necesitamos completar nada, porque todo el trabajo lo hace passport
});

ROUTER.get("/googlecallback", passport.authenticate("google", { failureRedirect: "/login" }), async(req, res) => {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/admin");
});

export default ROUTER;