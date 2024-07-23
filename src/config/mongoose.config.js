import { connect, Types } from "mongoose";

const connectDB = async () => {
    const URI = "mongodb+srv://lubiano83:OdGteJUhwyj5SJ4H@lubiano83.egrhqkm.mongodb.net/?retryWrites=true&w=majority&appName=lubiano83";

    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "backend-1",
    };

    try {
        await connect(URI, options);
        console.log("Conectado a la base de datos");
    } catch (error) {
        console.error(error.message);
        return "Error al conectar a la base de datos";
    }
};

const isValidId = (id) => {
    return Types.ObjectId.isValid(id); // esto devuelve true o false.
};

export default { connectDB, isValidId };