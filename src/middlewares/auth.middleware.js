import { respuesta } from "../utils/reutilizable.js";

//Hacemos una funcion que verifique que seas admin:
export function soloAdmin(req, res, next) {
    if(req.user.role === "admin") {
        next();
    }else{
        respuesta(res, 403, "Acceso denegado, solo admin..");
    }
}

//Hacemos una funcion que verifique que seas user: 
export function soloUser(req, res, next) {
    if(req.user.role === "user") {
        next();
    }else {
        respuesta(res, 403, "Acceso denegado, solo usuarios..");
    }
}