import { isValidPassword } from "../utils/bcrypt.js";
import jwt from "jsonwebtoken";
import UserRepository from "../repositories/user.repository.js";
import CartDao from "../dao/cart.dao.js";

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async registerUser(userData) {
        const { email } = userData;

        try {
            const existingUser = await this.userRepository.findUserByEmail(email);
            console.log(existingUser);

            if (existingUser) {
                return "El usuario ya existe..";
            }

            const newCart = await CartDao.save({});

            const updatedData = {
                ...userData,
                cart: newCart._id,
            };

            return await this.userRepository.createUser(updatedData);
        } catch (error) {
            throw new Error("Error al registrar un usuario: " + error.message);
        }
    }

    async loginUser(userData) {
        const { email, password } = userData;

        try {
            const user = await this.userRepository.findUserByEmail(email);
            if (!user) {
                return "El usuario no existe..";
            }

            const passwordMatch = isValidPassword(password, user);
            if (!passwordMatch) {
                return "Contraseña incorrecta..";
            }

            const token = jwt.sign(
                { email: user.email, firstName: user.firstName, lastName: user.lastName, age: user.age, role: user.role, cart: user.cart, id: user._id.toString() },
                "coderhouse",
                { expiresIn: "1h" },
            );

            return token;
        } catch (error) {
            throw new Error("Error al ingresar un usuario: " + error.message);
        }
    }
}

export default UserService;