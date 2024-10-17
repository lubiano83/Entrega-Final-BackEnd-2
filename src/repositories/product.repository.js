import ProductDao from "../dao/product.dao.js";

class ProductRepository {
    async createProduct(productData) {
        return await ProductDao.save(productData);
    }

    async findProductById(id) {
        return await ProductDao.findOne({ id });
    }

    async updateProduct(id, productData) {
        return await ProductDao.update(id, productData);
    }

    async deleteProduct(id) {
        return await ProductDao.delete(id);
    }
}

export default ProductRepository;