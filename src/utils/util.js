import bcrypt from "bcrypt";
import passport from "passport";

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

const passportCall = (strategy) => {
    return async(req, res, next) => {
        passport.authenticate(strategy, (error, user, info) => {
            if(error) {
                return next(error);
            }
            if(!user) {
                res.status(401).send({ error: info.message ? info.message : info.toString() });
            }
            req.user = user;
            next();
        })(req, res, next);
    };
};

const authorization = (role) => {
    return async(req, res, next) => {
        if(req.user.role !== role) {
            return res.status(403).send("No tienes los permisos..");
        }
        next();
    };
};

export { createHash, isValidPassword, passportCall, authorization };