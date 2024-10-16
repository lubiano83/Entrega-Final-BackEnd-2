import CartModel from "../models/cart.model.js";

class CartDao {
    async findById(id) {
        return await CartModel.findById(id);
    }

    async findOne(query) {
        return await CartModel.findOne(query);
    }

    async save(userData) {
        const user = new CartModel(userData);
        return await user.save();
    }

    async update(id, userData) {
        return await CartModel.findByIdAndUpdate(id, userData);
    }

    async delete(id) {
        return await CartModel.findByIdAndDelete(id);
    }
}

export default new CartDao();