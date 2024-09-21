import { connect, Types } from "mongoose";
import dotenv from "dotenv";

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const connectDB = async () => {
    const URI = process.env.MONGO_URI;
    const options = { dbName: "backend-1" };

    try {
        await connect(URI, options);
        console.log("Conectado a la base de datos");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error.message);
        process.exit(1); // Detener el proceso si hay un error de conexión
    }
};

// Validación de un ObjectId de MongoDB
const isValidId = (id) => {
    return Types.ObjectId.isValid(id); // Devuelve true o false
};

export default { connectDB, isValidId };