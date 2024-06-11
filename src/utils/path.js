import path from "path";

const PATH = {
    root: path.dirname(""),
    src: path.join(path.dirname(""), "src"),
    public: path.join(path.dirname(""), "src", "public"),
    images: path.join(path.dirname(""), "src", "public", "images"),
    html: path.join(path.dirname(""), "src", "public", "html"),
    css: path.join(path.dirname(""), "src", "public", "css"),
    views: path.join(path.dirname(""), "src", "views"),
};

export default PATH;