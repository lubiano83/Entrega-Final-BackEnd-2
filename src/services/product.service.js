import ProductRepository from "../repositories/product.repository.js";

class ProductService {

    constructor() {
        this.productRepository = new ProductRepository();
    }

    addProduct = async(productData) => {
        try {
            return await this.productRepository.createProduct(productData);
        } catch (error) {
            throw new Error("Error al agregar un producto..");
        }
    };

    async getProducts(paramFilters = {}) {
        try {
            const $and = [];

            if (paramFilters.category) $and.push({ category: paramFilters.category });
            if (paramFilters.title) $and.push({ title: paramFilters.title });
            if (paramFilters.code) $and.push({ code: paramFilters.code });
            if (paramFilters.available) $and.push({ available: paramFilters.available });

            const filters = $and.length > 0 ? { $and } : {};

            let sort = {};
            if (paramFilters.sort) {
                sort.price = paramFilters.sort === "asc" ? 1 : -1;
            }

            const limit = paramFilters.limit ? parseInt(paramFilters.limit) : 10;
            const page = paramFilters.page ? parseInt(paramFilters.page) : 1;

            const productsFound = await this.productRepository.paginate(filters, {
                limit: limit,
                page: page,
                sort: sort,
                lean: true,
                pagination: true,
            });

            productsFound.docs = productsFound.docs.map(({ id, ...productWithoutId }) => productWithoutId);
            return productsFound;
        } catch (error) {
            throw new Error("Hubo un error al obtener los productos..");
        }
    }

    getProductById = async (id) => {
        try {
            const product = await this.productRepository.getProductById(id);
            return product;
        } catch (error) {
            throw new Error("Hubo un error al obtener el producto por el id.");
        }
    };

    deleteProductById = async (id) => {
        try {
            await this.productRepository.deleteProduct(id);
            return "Producto Eliminado";
        } catch (error) {
            throw new Error("Hubo un error al eliminar el producto");
        }
    };

    updateProduct = async (id, productData) => {
        try {
            const updatedProduct = await this.productRepository.updateProduct(id, productData);
            return updatedProduct;
        } catch (error) {
            throw new Error("Hubo un error al actualizar el producto");
        }
    };

    toggleAvailability = async (id) => {
        try {
            const product = await this.productRepository.getProductById(id);
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

    explain = async () => {
        try {
            const filters = { $and: [{ category: "BATERIA" }, { title: "55457" }] };
            return await this.productRepository.explain(filters);
        } catch (error) {
            throw new Error("Hubo un error al obtener los datos..");
        }
    };
}

export default ProductService;