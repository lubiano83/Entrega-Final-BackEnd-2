import passport from "passport";
import local, { Strategy } from "passport-local";
import UserModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import GitHubStrategy from "passport-github2";
import GoogleStrategy from "passport-google-oauth20";
import jwt from "passport-jwt";
// import FacebookStrategy from "passport-facebook";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const initializePassport = () => {

    const cookieExtractor = (req) => {
        let token = null;
        if(req && req.cookies) {
            token = req.cookies["coderCookieToken"];
        }
        return token;
    };

    passport.use("jwt", new JWTStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: "coderhouse",
        },
        async (jwt_payload, done) => {
            try {
                return done(null, jwt_payload);
            } catch (error) {
                return done(error);
            }
        },
    )); // Este paréntesis cierra la llamada a passport.use

    passport.use("register", new LocalStrategy({
        // Le digo que quiero tener acceso al objeto request
        passReqToCallback: true,
        usernameField: "email",
    }, async(req, username, password, done) =>{
        const { first_name, last_name, email, age } = req.body;
        try {
            // Verificamos que ya existe un registro con ese email
            const user = await UserModel.findOne({ email });
            if(user) return done(null, false);

            // Pero si no existe, voy a crear un registro de usuario nuevo
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
            };

            const result = await UserModel.create(newUser);
            // Si todo resulta bien, mandamos done con el usuario generado
            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }));

    // agregamos otra estrategia mas, ahora para el login
    passport.use("login", new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
                const usuario = await UserModel.findOne({ email });
                if (!usuario) {
                    return done(null, false, { message: "Usuario no encontrado" });
                }

                if (!isValidPassword(password, usuario.password)) {
                    return done(null, false, { message: "Contraseña incorrecta" });
                }

                return done(null, usuario);
            } catch (error) {
                return done(error);
            }
        },
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser( async(id, done) => {
        const user = await UserModel.findById({ _id: id });
        done(null, user);
    });

    // Aca desarrollamos la nueva estrategia con github
    passport.use("github", new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
    }, async (accessToken, refreshToken, profile, done) => {
        // Recomendado! Mostrar el perfil por consola para conocer los datos que me llegan.
        console.log("Profile", profile);
        try {
            const user = await UserModel.findOne({ email: profile._json.email });
            if(!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 37,
                    email: profile._json.email,
                    password: "",
                };
                const result = await UserModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            done(error);
        }
    }));

    // Nueva estrategia con google
    passport.use("google", new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    }, async(accessToken, refreshToken, profile, done) => {
        // Recomendado! Mostrar el perfil por consola para conocer los datos que me llegan.
        console.log("Profile Google:", profile);
        try {
            const user = await UserModel.findOne({ email: profile._json.email });
            if(!user) {
                let newUser = {
                    first_name: profile._json.given_name,
                    last_name: profile._json.family_name,
                    age: 37,
                    email: profile._json.email,
                    password: "",
                };
                const result = await UserModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            done(error);
        }
    }));

    // passport.use(new FacebookStrategy({
    //     clientID: "tusdatos",
    //     clientSecret: "tusdatos",
    //     callbackURL: "http://localhost:8080/auth/facebook/callback",
    // }, async (accessToken, refreshToken, profile, done) => {
    //     console.log(profile);
    //     const user = await UsuarioModel.findOne({
    //         accountId: profile.id,
    //         provider: "Facebook",
    //     });

    //     if(!user) {
    //         console.log("Agregando un nuevo usuario a la Base de Datos");

    //         const newUser = new UsuarioModel({
    //             first_name: profile.displayName,
    //             accountId: profile.id,
    //             provider: "Facebook",
    //         });

    //         await newUser.save();
    //         return done(null, profile);
    //     } else {
    //         console.log("El usuario ya existe");
    //         return done(null, profile);
    //     }
    // }));
};

export default initializePassport;