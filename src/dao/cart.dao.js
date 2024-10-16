import CartModel from "../models/cart.model.js";
import mongoDB from "../config/mongoose.config.js";

class CartDao {
    async findById(id) {
        if (!mongoDB.isValidId(id)) {
            return "ID no válido";
        }
        return await CartModel.findById(id);
    }

    async findOne(query) {
        return await CartModel.findOne(query);
    }

    async find() {
        return await CartModel.find().populate("products").lean();
    }

    async save(cartData) {
        const cart = new CartModel(cartData);
        return await cart.save();
    }

    async update(id, cartData) {
        if (!mongoDB.isValidId(id)) {
            return "ID no válido";
        }
        return await CartModel.findByIdAndUpdate(id, cartData, { new: true });
    }

    async delete(id) {
        if (!mongoDB.isValidId(id)) {
            return "ID no válido";
        }
        return await CartModel.findByIdAndDelete(id);
    }
}

export default new CartDao();