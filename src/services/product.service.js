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

            // Manejo de ordenamiento
            let sort = {};
            if (paramFilters.sort) {
                sort.price = paramFilters.sort === "asc" ? 1 : -1; // Ascendente o descendente por precio
            }

            // Configuración de paginación
            const limit = paramFilters.limit ? parseInt(paramFilters.limit) : 10; // Limite por defecto
            const page = paramFilters.page ? parseInt(paramFilters.page) : 1; // Página por defecto

            // Calcular el número de documentos a saltar
            const skip = (page - 1) * limit;

            // Obtener productos con paginación
            const productsFound = await ProductModel.paginate(filters, {
                limit: limit,
                page: page,
                sort: sort,
                lean: true,
                pagination: true,
                offset: skip, // Usa offset si tu método lo requiere
            });

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