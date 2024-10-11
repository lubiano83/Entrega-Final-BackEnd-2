import UserService from "../services/user.service.js";
import { createHash } from "../utils/bcrypt.js";

const userService = new UserService();

class UserController {

    registerUser = async(req, res) => {
        const { firstName, lastName, email, age, password } = req.body;

        try {
            if(!firstName || !lastName || !email || !age || !password) {
                return res.status(400).json({ message: "Todos los campos son requeridos.." });
            }

            const updatedData = {
                firstName,
                lastName,
                email,
                age,
                password: createHash(password),
            };

            await userService.registerUser(updatedData);
            res.redirect("/");
        } catch (error) {
            res.status(500).json({ message: error.message, error });
        }
    };

    loginUser = async(req, res) => {
        const { email, password } = req.body;

        try {
            if (!email || !password) {
                return res.status(400).json({ message: "Todos los campos son necesarios." });
            }

            const token = await userService.loginUser({ email, password });

            res.cookie("coderCookieToken", token, { maxAge: 3600000, httpOnly: true });
            res.redirect("/api/sessions/current");
        } catch (error) {
            res.status(500).json({ message: error.message, error });
        }
    };

    logoutUser = async(req, res) => {
        res.clearCookie("coderCookieToken");
        res.redirect("/");
    };

    currentUser = (req, res) => {

        if(req.user.role !== "admin") {
            return res.redirect("/profile");
        }

        res.render("home", { usuario: req.user });
    };
}

export default UserController;