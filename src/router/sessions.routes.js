import { Router } from "express";
import UsuarioModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import passport from "passport";
import { createHash, isValidPassword } from "../utils/util.js";
import CartModel from "../models/cart.model.js";

const ROUTER = Router();

// Register
ROUTER.post("/register", async(req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    try {
        // Verificamos si el usuario ya existe
        const existeUsuario = await UsuarioModel.findOne({ email });
        console.log(existeUsuario);

        if(existeUsuario) {
            return res.status(400).send("El usuario ya existe..");
        }

        const nuevoCarrito = new CartModel();
        await nuevoCarrito.save();

        // Creamos un nuevo usuario
        const nuevoUsuario = await UsuarioModel({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: nuevoCarrito._id,
        });

        await nuevoUsuario.save();

        // Enviamos al usuario a login
        res.redirect("/");

    } catch (error) {
        res.status(500).send("Error interno del servidor..");
    }
});

// Login
ROUTER.post("/login", async(req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar el usuario en MongoDB
        const usuarioEncontrado = await UsuarioModel.findOne({ email });

        if(!usuarioEncontrado) {
            return res.status(401).send("El usuario no existe..");
        }

        // Verificamos la contraseña
        if(!isValidPassword(password, usuarioEncontrado)) {
            return res.status(401).send("Contraseña incorrecta..");
        }

        // Generar el token JWT
        const token = jwt.sign({ email: usuarioEncontrado.email, role: usuarioEncontrado.role, first_name: usuarioEncontrado.first_name, last_name: usuarioEncontrado.last_name, age: usuarioEncontrado.age }, "coderhouse", { expiresIn: "1h" });

        // Creamos la Cookie
        res.cookie("coderCookieToken", token, { maxAge: 3600000, httpOnly: true });

        // Enviamos al home
        res.redirect("/api/sessions/current");

    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
});

ROUTER.post("/logout", async(req, res) => {
    // Limpiamos la cookie
    res.clearCookie("coderCookieToken");
    // Enviamos al login
    res.redirect("/");
});

// Ruta Admin
ROUTER.get("/current", passport.authenticate("current", { session: false }), (req, res) => {

    if(req.user.role !== "admin") {
        return res.redirect("/profile");
    }

    // Si el usuario es administrador, mostrar la vista correcta
    res.render("home", { usuario: req.user });
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