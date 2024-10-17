import mongoDB from "../config/mongoose.config.js";
import ProductDao from "../dao/product.dao.js";
import ProductRepository from "../repositories/product.repository.js";

class ProductService {

    constructor() {
        this.userRepository = new ProductRepository();
    }

    addProduct = async(productData) => {
        try {
            return await this.userRepository.createProduct(productData);
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

            // Obtener productos con paginación
            const productsFound = await ProductDao.paginate(filters, {
                limit: limit,
                page: page,
                sort: sort,
                lean: true,
                pagination: true,
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
            const product = await ProductDao.findById(id);
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
            await ProductDao.delete(id);
            return "Producto Eliminado";
        } catch (error) {
            throw new Error("Hubo un error al eliminar el producto");
        }
    };

    updateProduct = async (id, productData) => {
        if (!mongoDB.isValidId(id)) {
            return null;
        }
        try {
            const updatedProduct = await ProductDao.findByIdAndUpdate(id, productData);
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
            const product = await ProductDao.findById(id);
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

    explain = async() => {
        try {
            const filters = { $and: [{ category: "BATERIA" }, { title: "55457" }] };
            return await ProductDao.explain(filters);
        } catch (error) {
            throw new Error("Hubo un error al obtener los datos..");
        }
    };
}

export default ProductService;