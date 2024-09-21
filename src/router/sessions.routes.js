import { Router } from "express";
import UserModel from "../models/user.model.js";

const ROUTER = Router();

// Ruta post para generar un nuevo usuario
ROUTER.post("/register", async (req, res) => {
    let { first_name, last_name, email, password, age } = req.body;

    try {
        // Verificar si el correo ya esta registrado
        const existeUsuario = await UserModel.findOne({ email: email });

        if(existeUsuario) {
            return res.send("El correo ya esta registrado");
        }

        // Crear un usuario
        const nuevoUsuario = await UserModel.create({
            first_name,
            last_name,
            email,
            password,
            age,
        });

        // Almacenar los datos del usuario en la session
        req.session.user = {
            first_name: nuevoUsuario.first_name,
            last_name: nuevoUsuario.last_name,
            email: nuevoUsuario.email,
        };

        req.session.login = true;
        res.status(201).redirect("/admin");
    } catch (error) {
        res.status(500).send("Error interno del servidor", error);
    }
});

// Ruta para el login
ROUTER.post("/login", async (req, res) => {
    let { email, password } = req.body;

    try {
        const usuarioBuscado = await UserModel.findOne({ email: email });

        if (usuarioBuscado) {
            if (usuarioBuscado.password === password) {
                req.session.user = {
                    first_name: usuarioBuscado.first_name,
                    last_name: usuarioBuscado.last_name,
                    email: usuarioBuscado.email
                };

                req.session.login = true;
                return res.redirect("/admin"); // Asegúrate de redirigir aquí
            } else {
                return res.status(401).send("Contraseña incorrecta.");
            }
        } else {
            return res.status(404).send("¡Usuario no encontrado!");
        }
    } catch (error) {
        return res.status(500).send("Error interno del servidor", error);
    }
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

export default ROUTER;