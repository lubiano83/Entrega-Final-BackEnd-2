import { isValidPassword } from "../utils/bcrypt.js";
import jwt from "jsonwebtoken";
import UserDao from "../dao/user.dao.js";
import CartDao from "../dao/cart.dao.js";

class UserService {

    registerUser = async(userData) => {
        const { email } = userData;

        try {
            const existingUser = await UserDao.findOne({ email });
            console.log(existingUser);

            if(existingUser) {
                return "El usuario ya existe..";
            }

            const newCart = await CartDao.save({});

            const updatedData = {
                ...userData,
                cart: newCart._id,
            };

            return await UserDao.save(updatedData);
        } catch (error) {
            throw new Error("Error al registrar un usuario..", error);
        }
    };

    loginUser = async(userData) => {
        const { email, password } = userData;

        try {
            const user = await UserDao.findOne({ email });
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

    getCartId = async () => {
        try {
            const user = await UserDao.findOne();
            if (!user || !user.cart) {
                throw new Error("Usuario no encontrado o no tiene carrito asignado.");
            }

            const cartId = user.cart.toString();
            return cartId;
        } catch (error) {
            throw new Error("Error al obtener el id del carrito: " + error.message);
        }
    };
}

export default UserService;