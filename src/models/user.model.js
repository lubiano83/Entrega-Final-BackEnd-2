import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Asegura que el email sea único
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: [ "admin", "user" ],
        default: "user",
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts",
    },
});

const UsuarioModel = mongoose.model("usuarios", usuarioSchema);
export default UsuarioModel;