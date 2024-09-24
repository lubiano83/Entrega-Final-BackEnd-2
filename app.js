import express from "express";
import mongoDB from "./src/config/mongoose.config.js";
import productRouter from "./src/router/api.product.routes.js";
import viewsProductRouter from "./src/router/app.product.routes.js";
import cartRouter from "./src/router/api.cart.routes.js";
import viewsCartRouter from "./src/router/app.cart.routes.js";
import viewsRouter from "./src/router/views.routes.js";
import PATH from "./src/utils/path.js";
import handlebars from "./src/config/handlebars.config.js";
import serverSocket from "./src/config/socket.config.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import sessionsRouter from "./src/router/sessions.routes.js";
import passport from "passport";
import initializePassport from "./src/config/passport.config.js";
import cookieParser from "cookie-parser";

const PORT = 8080;
const HOST = "localhost";
const APP = express();

// Middlewares
APP.use(express.json());
APP.use(express.urlencoded({ extended: true }));
APP.use(cookieParser());
APP.use(passport.initialize());

// configuración del motor de plantillas
handlebars.CONFIG(APP);

// Configuración de sesiones
APP.use(session({
    secret: process.env.SESSION_SECRET || "secretCoder", // Utiliza variable de entorno para mayor seguridad
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL, ttl: 100 }),
}));

// cambios para usar passport
initializePassport();
APP.use(passport.initialize());
APP.use(passport.session());

// declaración de ruta estática
APP.use("/", express.static(PATH.public));
APP.use("/products", express.static(PATH.public));
APP.use("/carts", express.static(PATH.public));
APP.use("/realTimeProducts", express.static(PATH.public));

// Declaración de enrutadores
APP.use("/", viewsRouter);
APP.use("/carts", viewsCartRouter);
APP.use("/products", viewsProductRouter);
APP.use("/api/products", productRouter);
APP.use("/api/carts", cartRouter);
APP.use("/api/sessions", sessionsRouter);

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