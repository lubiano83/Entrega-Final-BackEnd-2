import CartModel from "../models/cart.model.js";
import CartDao from "../dao/cart.dao.js";
import ProductDao from "../dao/product.dao.js";
import mongoDB from "../config/mongoose.config.js";

class CartService {
    getCarts = async() => {
        try {
            const carts = await CartDao.find();
            return carts;
        } catch (error) {
            throw new Error("Error al obtener los carritos..");
        }
    };

    addCart = async() => {
        try {
            return await CartDao.save({ products: [] });
        } catch (error) {
            throw new Error("Error al agregar un carrito..");
        }
    };

    getCartById = async(id) => {
        try {
            const cart = await CartDao.findById(id);
            return cart;
        } catch (error) {
            throw new Error("Error al obtener el carrito..");
        }
    };

    deleteCartById = async(id) => {
        try {
            return await CartDao.delete(id);
        } catch (error) {
            throw new Error("Error al eliminar el carrito..");
        }
    };

    updateCart = async (id, updateData) => {
        try {
            const cart = await CartDao.findById(id);
            if (!cart) {
                return "Ese Id no existe";
            }

            cart.products = updateData.products;
            const updatedCart = await CartDao.update(id, cart);

            return updatedCart;
        } catch (error) {
            throw new Error("Error al editar el carrito: " + error.message);
        }
    };

    addProductToCart = async (cartId, productId) => {
        try {
            const cart = await CartDao.findById(cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            const product = await ProductDao.findById(productId);
            if (!product) {
                throw new Error("Producto no encontrado");
            }

            const productInCart = cart.products.find((p) => p.id._id.toString() === productId.toString());

            if (productInCart) {
                productInCart.quantity += 1;
            } else {
                cart.products.push({ id: product._id, quantity: 1 });
            }

            await CartDao.update(cartId, cart);
            return productInCart ? "Cantidad incrementada" : "Producto agregado";
        } catch (error) {
            throw new Error("Error al agregar el producto al carrito: " + error.message);
        }
    };

    deleteProductFromCart = async (cartId, productId) => {
        try {
            const cart = await CartDao.findById(cartId);
            if (!cart) {
                return "Carrito no encontrado";
            }

            const productIndex = cart.products.findIndex((p) => p.id._id.toString() === productId.toString());

            if (productIndex !== -1) {
                cart.products.splice(productIndex, 1);
                return await CartDao.update(cartId, cart);
            } else {
                return "Producto no encontrado en el carrito";
            }
        } catch (error) {
            throw new Error("Error al eliminar el producto del carrito..");
        }
    };

    updateCartQuantity = async (cartId, productId, quantity) => {
        try {
            const cart = await CartDao.findById(cartId);

            if (!cart) {
                return "Carrito no encontrado";
            }

            const productIndex = cart.products.findIndex((p) => p.id._id.toString() === productId.toString());

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = quantity;
                return await CartDao.update(cartId, cart);
            } else {
                return "Producto no encontrado en el carrito";
            }
        } catch (error) {
            throw new Error("Error al actualizar la cantidad del producto..");
        }
    };

    clearCart = async (cartId) => {
        try {
            const cart = await CartDao.findById(cartId);
            if (!cart) {
                return false;
            }
            cart.products = [];
            return await CartDao.update(cartId, cart);
        } catch (error) {
            throw new Error("Error al limpiar el carrito..");
        }
    };
}

export default CartService;