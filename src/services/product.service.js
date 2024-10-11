import ProductModel from "../models/product.model.js";
import mongoDB from "../config/mongoose.config.js";

class ProductService {

    addProduct = async(productData) => {
        try {
            const product = new ProductModel(productData);
            return await product.save();
        } catch (error) {
            throw new Error("Error al agregar un producto..");
        }
    };

    async getProducts(paramFilters = {}) {
        try {
            const $and = [];

            // Construir filtros
            if (paramFilters.category) $and.push({ category: paramFilters.category });
            if (paramFilters.title) $and.push({ title: paramFilters.title });
            if (paramFilters.code) $and.push({ code: paramFilters.code });
            if (paramFilters.available) $and.push({ available: paramFilters.available });

            const filters = $and.length > 0 ? { $and } : {};

            // Si no hay filtros, devuelve todos los productos
            if (Object.keys(filters).length === 0) {
                return await ProductModel.find({}).lean(); // Devuelve todos los productos
            }

            // Manejo de ordenamiento
            let sort = {};
            if (paramFilters.sort && (paramFilters.sort === "asc" || paramFilters.sort === "desc")) {
                sort = { price: paramFilters.sort === "desc" ? -1 : 1 };
            }

            // Configuración de paginación
            const defaultLimit = 10;
            const defaultPage = 1;

            const skip = (paramFilters.page ? (parseInt(paramFilters.page) - 1) : (defaultPage - 1)) * (paramFilters.limit ? parseInt(paramFilters.limit) : defaultLimit);

            const paginationOptions = {
                limit: paramFilters.limit ? parseInt(paramFilters.limit) : defaultLimit,
                page: paramFilters.page ? parseInt(paramFilters.page) : defaultPage,
                sort: sort,
                skip: skip,
                lean: true,
            };

            // Obtener productos con paginación
            const productsFound = await ProductModel.paginate(filters, paginationOptions);

            // Eliminar el campo 'id' de cada producto en los resultados
            productsFound.docs = productsFound.docs.map(({ id, ...productWithoutId }) => productWithoutId);

            return productsFound;
        } catch (error) {
            throw new Error("Hubo un error al obtener los productos..");
        }
    }

    getProductById = async (id) => {
        if (!mongoDB.isValidId(id)) {
            return null;
        }
        try {
            const product = await ProductModel.findById(id);
            return product;
        } catch (error) {
            throw new Error("Hubo un error al obtener el producto por el id.");
        }
    };

    deleteProductById = async (id) => {
        if (!mongoDB.isValidId(id)) {
            return null;
        }
        try {
            await ProductModel.findByIdAndDelete(id);
            return "Producto Eliminado";
        } catch (error) {
            throw new Error("Hubo un error al eliminar el producto");
        }
    };

    updateProduct = async (id, updateData) => {
        if (!mongoDB.isValidId(id)) {
            return null;
        }
        try {
            const updatedProduct = await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
            return updatedProduct;
        } catch (error) {
            throw new Error("Hubo un error al actualizar el producto");
        }
    };

    toggleAvailability = async (id) => {
        if (!mongoDB.isValidId(id)) {
            return null;
        }
        try {
            const product = await ProductModel.findById(id);
            if (product) {
                product.available = !product.available;
                await product.save();
                return product;
            } else {
                return "Producto no encontrado";
            }
        } catch (error) {
            throw new Error("Hubo un error al cambiar la disponibilidad del producto");
        }
    };
}

export default ProductService;