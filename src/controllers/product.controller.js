import ProductService from "../services/product.service.js";

const productService = new ProductService();

export default class ProductController {
    // Funciones públicas
    addProduct = async (req, res) => {
        const { category, title, description, price, thumbnail = [], code, stock } = req.body;

        if (!category || !title || !description || !price || !code || !stock) {
            return res.status(400).json({ status: false, message: "Todos los campos son obligatorios" });
        }

        try {
            const products = await productService.getProducts();
            const sameCode = products.find((product) => product.code === code);
            if (sameCode){
                return res.status(400).json({ status: false, message: "El código ya existe" });
            }

            const productData = {
                category,
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
            };

            const newProduct = await productService.addProduct(productData);
            return res.status(201).json({ status: true, payload: newProduct });
        } catch (error) {
            respuesta(res, 500, "Hubo un error al agregar el producto..");
        }
    };

    async getProducts(req, res) {
        try {
            const paramFilters = req.query;
            const products = await productService.getProducts(paramFilters);

            return res.status(200).json(products);
        } catch (error) {
            respuesta(res, 500, "Hubo un error al obtener los productos..");
        }
    }

    getProductById = async (req, res) => {
        const { id } = req.params;

        try {
            const product = await productService.getProductById(id);
            if (!product) {
                return res.status(404).json({ status: false, message: "Producto no encontrado" });
            }
            res.status(200).json({ status: true, payload: product });
        } catch (error) {
            respuesta(res, 500, "Hubo un error al obtener el producto por el id..");
        }
    };

    deleteProductById = async (req, res) => {
        const { id } = req.params;

        try {
            const product = await productService.deleteProductById(id);
            res.status(200).json({ status: true, payload: product });
        } catch (error) {
            respuesta(res, 500, "Hubo un error al eliminar el producto por el id..");
        }
    };

    updateProduct = async (req, res) => {
        const { id } = req.params;
        const { category, title, description, price, thumbnail, code, stock } = req.body;

        const updateData = { category, title, description, price, thumbnail, code, stock };

        try {
            const updatedProduct = await productService.updateProduct(id, updateData);
            if (!updatedProduct) {
                return res.status(404).json({ status: false, message: "Producto no encontrado" });
            }
            res.status(200).json({ status: true, payload: updatedProduct, message: "Producto Modificado" });
        } catch (error) {
            respuesta(res, 500, "Hubo un error al actualizar el producto..");
        }
    };

    toggleAvailability = async (req, res) => {
        const { id } = req.params;

        try {
            const product = await productService.toggleAvailability(id);
            res.status(200).json({ status: true, payload: product });
        } catch (error) {
            respuesta(res, 500, "Hubo un error al cambiar la disponibilidad del producto..");
        }
    };
}