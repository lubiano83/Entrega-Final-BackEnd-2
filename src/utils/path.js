import path from "path";

const PATH = {
    root: path.dirname(""),
    src: path.join(path.dirname(""), "src"),
    public: path.join(path.dirname(""), "src", "public"),
    views: path.join(path.dirname(""), "src", "views"),
};

export default PATH;