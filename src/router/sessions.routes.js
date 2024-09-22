import { Router } from "express";
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
        email: req.user.email
    }

    req.session.login = true;
    res.redirect("/admin");
});

ROUTER.get("/failregister", (req, res) => {
    res.send("¡Fallo el registro de usuario!");
});

// Login version para passport
ROUTER.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin" }), async (req, res) => {
    // Si la autenticación es exitosa, req.user estará disponible
    if (!req.user) {
        return res.send("Credenciales inválidas.");
    }

    // Guardar la información del usuario en la sesión
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        rol: req.user.rol || "usuario",  // Asegúrate de incluir el rol
    };

    req.session.login = true;  // Indicar que el usuario ha iniciado sesión

    // Redirigir al perfil del usuario
    res.redirect("/admin");
});

ROUTER.get("/faillogin", (req, res) => {
    res.send("¡Fallo el login de usuario!");
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
ROUTER.get("/github", passport.authenticate("github", {scope: ["user: email"]}), (req, res) => {});

ROUTER.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async(req, res) => {
    // La estrategia de github nos retornara el usuario, entonces lo agregamos a nuestro objeto de session.
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/admin");
});

// Version para Google
ROUTER.get("/google", passport.authenticate("google", {scope: ["profile", "email"]}), async(req, res) => {
    // No necesitamos completar nada, porque todo el trabajo lo hace passport
});

ROUTER.get("/googlecallback", passport.authenticate("google", {failureRedirect: "/login"}), async(req, res) => {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/admin");
})

export default ROUTER;