import ProductModel from "../models/product.model.js";
import mongoDB from "../config/mongoose.config.js";

export default class ProductManager {
    #itemModel;

    // Constructor
    constructor() {
        this.#itemModel = ProductModel;
    }

    // Funciones públicas
    addProduct = async ({ category, title, description, price, thumbnail = [], code, stock, available }) => {

        if (!category || !title || !description || !price || !code || !stock) {
            console.log("Todos los campos son obligatorios");
        }
        const products = await this.#itemModel.find().lean();
        try {
            const product = new this.#itemModel({
                category,
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                available: available !== undefined ? available : true,
            });
            const sameCode = products.find((product) => product.code === code);
            if (sameCode){
                return "El codigo ya existe";
            }
            await product.save();
            return "Producto agregado correctamente";
        } catch (error) {
            console.log(error.message);
            return "Hubo un error al agregar el producto";
        }
    };

    getProductById = async (id) => {
        if (!mongoDB.isValidId(id)) {
            return null;
        }
        try {
            const product = await this.#itemModel.findById(id);
            return product;
        } catch (error) {
            console.log(error.message);
            return "Hubo un error al obtener el producto";
        }
    };

    deleteProductById = async (id) => {
        if (!mongoDB.isValidId(id)) {
            return null;
        }
        try {
            await this.#itemModel.findByIdAndDelete(id);
            return "Producto Eliminado";
        } catch (error) {
            console.log(error.message);
            return "Hubo un error al eliminar el producto";
        }
    };

    updateProduct = async ( id, updateData ) => {
        if (!mongoDB.isValidId(id)) {
            return null;
        }
        try {
            const updatedProduct = await this.#itemModel.findByIdAndUpdate(id, updateData, { new: true });
            if (updatedProduct) {
                return "Producto Modificado";
            } else {
                return "Producto no encontrado";
            }
        } catch (error) {
            console.log(error.message);
            return "Hubo un error al actualizar el producto";
        }
    };

    toggleAvailability = async (id) => {
        if (!mongoDB.isValidId(id)) {
            return null;
        }
        try {
            const product = await this.#itemModel.findById(id);
            if (product) {
                product.available = !product.available;
                await product.save();
                return product;
            } else {
                return "Producto no encontrado";
            }
        } catch (error) {
            console.log(error.message);
            return "Hubo un error al cambiar la disponibilidad del producto";
        }
    };

    getProducts = async (paramFilters) => {
        try {
            const $and = [];

            if (paramFilters?.category) $and.push({ category: paramFilters.category });
            if (paramFilters?.title) $and.push({ title: paramFilters.title });
            if (paramFilters?.code) $and.push({ code: paramFilters.code });
            if (paramFilters?.available) $and.push({ available: paramFilters.available });

            const filters = $and.length > 0 ? { $and } : {};

            let sort = {};
            if (paramFilters?.sort && (paramFilters.sort === "asc" || paramFilters.sort === "desc")) {
                sort = {
                    price: paramFilters.sort === "desc" ? -1 : 1,
                };
            }

            const defaultLimit = 10;
            const defaultPage = 1;

            const skip = (paramFilters?.page ? (parseInt(paramFilters.page) - 1) : (defaultPage - 1)) * (paramFilters?.limit ? parseInt(paramFilters.limit) : defaultLimit);

            const paginationOptions = {
                limit: paramFilters?.limit ? parseInt(paramFilters.limit) : defaultLimit,
                page: paramFilters?.page ? parseInt(paramFilters.page) : defaultPage,
                sort: sort,
                skip: skip,
                lean: true,
            };

            const productsFound = await this.#itemModel.paginate(filters, paginationOptions);

            // Remove the 'id' field from each product in the results
            productsFound.docs = productsFound.docs.map((product) => {
                const { id, ...productWithoutId } = product;
                console.log(id);
                return productWithoutId;
            });

            return { productsFound, skip };
        } catch (error) {
            console.log(error.message);
            return "Hubo un error al obtener los productos";
        }
    };
}