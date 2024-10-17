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

    async paginate(filters, { limit, page, sort }) {
        return await ProductDao.paginate(filters, {
            limit: limit,
            page: page,
            sort: sort,
            lean: true,
            pagination: true,
        });
    }

    async getProductById(productId) {
        return await ProductDao.findById(productId);
    }

    async explain(filters) {
        return await ProductDao.explain(filters);
    }
}

export default ProductRepository;