import UserModel from "../models/user.model.js";
import CartModel from "../models/cart.model.js";
import { isValidPassword } from "../utils/bcrypt.js";
import jwt from "jsonwebtoken";

class UserService {

    registerUser = async(userData) => {
        const { email } = userData;

        try {
            const existingUser = await UserModel.findOne({ email });
            console.log(existingUser);

            if(existingUser) {
                return "El usuario ya existe..";
            }

            const newCart = new CartModel();
            await newCart.save();

            const updatedData = {
                ...userData,
                cart: newCart._id,
            };

            const user = new UserModel(updatedData);
            return await user.save();
        } catch (error) {
            throw new Error("Error al registrar un usuario..", error);
        }
    };

    loginUser = async(userData) => {
        const { email, password } = userData;

        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                return "El usuario no existe..";
            }

            const passwordMatch = isValidPassword(password, user);
            if (!passwordMatch) {
                return "Contraseña incorrecta..";
            }

            const token = jwt.sign({ email: user.email, firstName: user.firstName, lastName: user.lastName, age: user.age, role: user.role, cart: user.cart }, "coderhouse", { expiresIn: "1h" });

            return token;
        } catch (error) {
            throw new Error("Error al ingresar un usuario..", error);
        }
    };
}

export default UserService;