import { Router } from "express";
import passport from "passport";
import UserModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import generateToken from "../utils/jsonwebtoken.js";

const ROUTER = Router();

// Register version para passport
ROUTER.post("/register", async (req, res) => {
    const { first_name, last_name, password, email, age } = req.body;

    try {
        // Verificar si el usuario ya está registrado
        const existeUsuario = await UserModel.findOne({ email });

        if (existeUsuario) {
            return res.send("El email ya está registrado");
        }

        // Si no existe, creamos un nuevo usuario
        const nuevoUsuario = await UserModel.create({
            first_name,
            last_name,
            email,
            password: createHash(password), // Encriptar la contraseña
            age,
            rol: "usuario", // Asigna un rol por defecto, si es necesario
        });

        // Generar el token si lo necesitas para algo específico
        const token = generateToken({
            first_name: nuevoUsuario.first_name,
            last_name: nuevoUsuario.last_name,
            email: nuevoUsuario.email,
        });

        console.log("Token generado:", token);

        // Guardar los datos del usuario en la sesión
        req.session.user = {
            first_name: nuevoUsuario.first_name,
            last_name: nuevoUsuario.last_name,
            email: nuevoUsuario.email,
            age: nuevoUsuario.age,
            rol: nuevoUsuario.rol || "usuario",  // Si tienes roles, asegúrate de guardarlo
        };

        req.session.login = true;  // Indicar que el usuario ha iniciado sesión

        // Redirigir al perfil o al área de administración después del registro
        res.redirect("/admin");  // O /admin dependiendo de tu flujo
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).send("Error en el servidor.");
    }
});

ROUTER.get("/failregister", (req, res) => {
    res.send("¡Fallo el registro de usuario!");
});

// Login version para passport
ROUTER.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await UserModel.findOne({ email });

        if (!usuario) {
            return res.send("Ese usuario no existe.");
        }

        // Validar la contraseña
        if (!isValidPassword(password, usuario.password)) {
            return res.send("Credenciales inválidas!");
        }

        // Guardar los datos del usuario en la sesión
        req.session.user = {
            first_name: usuario.first_name,
            last_name: usuario.last_name,
            email: usuario.email,
            age: usuario.age,
            rol: usuario.rol || "usuario",
        };

        req.session.login = true;

        res.redirect("/admin");
    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).send("Hubo un error en el servidor.");
    }
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
    res.redirect("/admin");
});

export default ROUTER;