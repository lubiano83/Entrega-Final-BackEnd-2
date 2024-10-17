import CartDao from "../dao/cart.dao.js";

class CartRepository {
    async createCart(cartData) {
        return await CartDao.save(cartData);
    }

    async findCartById(id) {
        return await CartDao.findOne({ id });
    }

    async updateCart(id, cartData) {
        return await CartDao.update(id, cartData);
    }

    async deleteCart(id) {
        return await CartDao.delete(id);
    }

    async getCarts() {
        return await CartDao.find();
    }

    async getCartById(cartId) {
        return await CartDao.findById(cartId);
    }
}

export default CartRepository;