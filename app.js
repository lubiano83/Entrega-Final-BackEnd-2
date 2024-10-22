import express from "express";
import mongoDB from "./src/config/mongoose.config.js";
import productRouter from "./src/routes/api.product.router.js";
import viewsProductRouter from "./src/routes/app.product.router.js";
import cartRouter from "./src/routes/api.cart.router.js";
import viewsCartRouter from "./src/routes/app.cart.router.js";
import viewsRouter from "./src/routes/views.router.js";
import PATH from "./src/utils/path.js";
import handlebars from "./src/config/handlebars.config.js";
import serverSocket from "./src/config/socket.config.js";
import userRouter from "./src/routes/user.router.js";
import passport from "passport";
import initializePassport from "./src/config/passport.config.js";
import cookieParser from "cookie-parser";
import { soloAdmin, soloUser } from "./src/middlewares/auth.middleware.js";

// Variables
const PORT = 8080;
const HOST = "localhost";
const APP = express();
const permissions = passport.authenticate("current", { session: false });

// Middlewares
APP.use(express.json());
APP.use(express.urlencoded({ extended: true }));
APP.use(cookieParser());
APP.use(passport.initialize());
initializePassport();

// configuración del motor de plantillas
handlebars.CONFIG(APP);

// declaración de ruta estática
APP.use("/", express.static(PATH.public));
APP.use("/products", express.static(PATH.public));
APP.use("/carts", express.static(PATH.public));
APP.use("/realTimeProducts", express.static(PATH.public));
APP.use("/api/sessions", express.static(PATH.public));

// Declaración de enrutadores
APP.use("/", viewsRouter);
APP.use("/carts", permissions, soloUser, viewsCartRouter);
APP.use("/api/carts", permissions, soloAdmin, cartRouter);
APP.use("/products", permissions, soloUser, viewsProductRouter);
APP.use("/api/products", permissions, soloAdmin, productRouter);
APP.use("/api/sessions", userRouter);

// Método que gestiona las rutas inexistentes.
APP.use("*", (req, res) => {
    return res.status(404).send("<h1>Error 404: Not Found</h1>");
});

// Control de errores internos
APP.use((error, req, res) => {
    console.error("Error:", error.message);
    res.status(500).send("<h1>Error 500: Error en el Servidor</h1>");
});

// Método oyente de solicitudes
const serverHTTP = APP.listen(PORT, () => {
    console.log(`Ejecutándose en http://${HOST}:${PORT}`);
    mongoDB.connectDB();
});

// Envío del serverHTTP al socket.config.js
serverSocket.CONFIG(serverHTTP);