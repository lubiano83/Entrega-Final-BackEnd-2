import ProductService from "../services/product.service.js";
import CartService from "../services/cart.service.js";
import UserService from "../services/user.service.js";
import { respuesta } from "../utils/reutilizable.js";

const productService = new ProductService();
const cartService = new CartService();
const userService = new UserService();

export default class ProductController {

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

    appGetProducts = async(req, res) => {
        const paramFilters = req.query;
        try {
            const allProducts = await productService.getProducts(paramFilters);
            return res.status(200).render("products", { title: "Products", products: allProducts });
        } catch (error) {
            respuesta(res, 500, "Hubo un error al obtener los productos..");
        }
    };

    appGetProductById = async (req, res) => {
        const { id } = req.params;

        try {
            const product = await productService.getProductById(id);
            if (!product) {
                return res.status(404).json({ status: false, message: "Producto no encontrado" });
            }
            return res.status(200).render("productDetail", { title: "Product Detail", product: product });
        } catch (error) {
            respuesta(res, 500, "Hubo un error al obtener el producto por el id..");
        }
    };

    appAddProductToCart = async (req, res) => {
        const { id: productId } = req.params;
        try {
            const cartId = await userService.getCartId();
            const product = await cartService.addProductToCart(cartId, productId);
            respuesta(res, 200, product);
        } catch (error) {
            respuesta(res, 500, "Hubo un error al agregar el producto al carrito: " + error.message);
        }
    };

    explain = async(req, res) => {
        try {
            const result = await productService.explain();
            res.status(200).json({ status: true, payload: result.executionStats });
        } catch (error) {
            respuesta(res, 500, "Hubo un error al obtener los datos..");
        }
    };

    realTimeProducts = async(req, res) => {
        try {
            return res.status(200).render("realTimeProducts", { title: "realTimeProducts" });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
        }
    };
}