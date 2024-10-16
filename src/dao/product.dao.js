import ProductModel from "../models/product.model.js";
import mongoDB from "../config/mongoose.config.js";

class ProductDao {
    async findById(id) {
        if (!mongoDB.isValidId(id)) {
            return "ID no válido";
        }
        return await ProductModel.findById(id);
    }

    async findByIdAndUpdate(id, productData) {
        if (!mongoDB.isValidId(id)) {
            return "ID no válido";
        }
        return await ProductModel.findByIdAndUpdate(id, productData);
    }

    async find() {
        return await ProductModel.find();
    }

    async findOne(query) {
        return await ProductModel.findOne(query);
    }

    async save(productData) {
        const product = new ProductModel(productData);
        return await product.save();
    }

    async update(id, productData) {
        if (!mongoDB.isValidId(id)) {
            return "ID no válido";
        }
        return await ProductModel.findByIdAndUpdate(id, productData);
    }

    async delete(id) {
        if (!mongoDB.isValidId(id)) {
            return "ID no válido";
        }
        return await ProductModel.findByIdAndDelete(id);
    }

    async paginate(filters, { limit, page, sort }) {
        return await ProductModel.paginate(filters, {
            limit: limit,
            page: page,
            sort: sort,
            lean: true,
            pagination: true,
        });
    }

    async explain(filters) {
        return await ProductModel.find(filters).explain();
    }
}

export default new ProductDao();