import handlebars from "express-handlebars";
import PATH from "../utils/path.js";

const CONFIG = (SERVER) => {
    SERVER.engine("handlebars", handlebars.engine({
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        },
    }));
    SERVER.set("views", PATH.views);
    SERVER.set("view engine", "handlebars");
};

export default { CONFIG };