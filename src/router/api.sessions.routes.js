import { Router } from "express";
import UserModel from "../models/user.model.js";

const ROUTER = Router();

// Ruta post para generar un nuevo usuario
ROUTER.post("/register", async (req, res) => {
    let { first_name, last_name, email, password, age, rol } = req.body;

    try {
        // Verificar si el correo ya está registrado
        const existeUsuario = await UserModel.findOne({ email: email });

        if (existeUsuario) {
            return res.status(400).json({
                status: false,
                message: "El correo ya está registrado"
            });
        }

        // Crear un nuevo usuario
        const nuevoUsuario = await UserModel.create({
            first_name,
            last_name,
            email,
            password,
            age,
            rol
        });

        // Almacenar los datos del usuario en la sesión
        req.session.user = {
            first_name: nuevoUsuario.first_name,
            last_name: nuevoUsuario.last_name,
            email: nuevoUsuario.email,
            age: nuevoUsuario.age, // Almacenar la edad
            rol: nuevoUsuario.rol  // Almacenar el rol
        };

        req.session.login = true;

        // Responder con el usuario creado y éxito
        return res.status(201).json({
            status: true,
            message: "Usuario registrado con éxito",
            user: {
                first_name: nuevoUsuario.first_name,
                last_name: nuevoUsuario.last_name,
                email: nuevoUsuario.email,
                age: nuevoUsuario.age,
                rol: nuevoUsuario.rol
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
});

// Ruta para el login
ROUTER.post("/login", async (req, res) => {
    let { email, password } = req.body;

    try {
        const usuarioBuscado = await UserModel.findOne({ email: email });

        if (usuarioBuscado) {
            if (usuarioBuscado.password === password) {
                // Almacenar los datos del usuario en la sesión
                req.session.user = {
                    first_name: usuarioBuscado.first_name,
                    last_name: usuarioBuscado.last_name,
                    email: usuarioBuscado.email,
                    age: usuarioBuscado.age, // Almacenar la edad
                    rol: usuarioBuscado.rol  // Almacenar el rol
                };

                req.session.login = true;

                // Responder con éxito
                return res.status(200).json({
                    status: true,
                    message: "Inicio de sesión exitoso",
                    user: {
                        first_name: usuarioBuscado.first_name,
                        last_name: usuarioBuscado.last_name,
                        email: usuarioBuscado.email,
                        age: usuarioBuscado.age,
                        rol: usuarioBuscado.rol
                    }
                });
            } else {
                return res.status(401).json({
                    status: false,
                    message: "Contraseña incorrecta"
                });
            }
        } else {
            return res.status(404).json({
                status: false,
                message: "Usuario no encontrado"
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
});

// Logout
ROUTER.get("/logout", (req, res) => {
    try {
        if (req.session.login) {
            req.session.destroy();
            return res.status(200).json({
                status: true,
                message: "Sesión cerrada con éxito"
            });
        } else {
            return res.status(400).json({
                status: false,
                message: "No hay sesión iniciada"
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
});

export default ROUTER;