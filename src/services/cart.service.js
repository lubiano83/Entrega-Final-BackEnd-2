import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";
import mongoDB from "../config/mongoose.config.js";

class CartService {
    getCarts = async() => {
        try {
            const carts = await CartModel.find().populate("products").lean();
            return carts;
        } catch (error) {
            throw new Error("Error al obtener los carritos..");
        }
    };

    addCart = async() => {
        try {
            const cart = new CartModel({ products: [] });
            return await cart.save();
        } catch (error) {
            throw new Error("Error al agregar un carrito..");
        }
    };

    getCartById = async(id) => {
        if (!mongoDB.isValidId(id)) {
            return "ID no válido";
        }
        try {
            const cart = await CartModel.findById(id);
            return cart;
        } catch (error) {
            throw new Error("Error al obtener el carrito..");
        }
    };

    deleteCartById = async(id) => {
        if (!mongoDB.isValidId(id)) {
            return "ID no válido";
        }
        try {
            return await CartModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error("Error al eliminar el carrito..");
        }
    };

    updateCart = async (id, updateData) => {
        if (!mongoDB.isValidId(id)) {
            return null;
        }
        try {
            const cart = await CartModel.findById(id);
            if (!cart) {
                return "Ese Id no existe";
            }

            cart.products = updateData.products;
            const updatedCart = await cart.save();

            return updatedCart;
        } catch (error) {
            throw new Error("Error al editar el carrito: " + error.message);
        }
    };

    addProductToCart = async (cartId, productId) => {
        if (!mongoDB.isValidId(cartId) || !mongoDB.isValidId(productId)) {
            return "ID no válido";
        }

        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            const product = await ProductModel.findById(productId);
            if (!product) {
                throw new Error("Producto no encontrado");
            }

            const productInCart = cart.products.find((p) => p.id._id.toString() === productId.toString());

            if (productInCart) {
                productInCart.quantity += 1;
                await cart.save();
                return "Cantidad incrementada";
            } else {
                cart.products.push({ id: product._id, quantity: 1 });
                await cart.save();
                return "Producto agregado";
            }
        } catch (error) {
            throw new Error("Error al agregar el producto al carrito..");
        }
    };

    deleteProductFromCart = async (cartId, productId) => {
        if (!mongoDB.isValidId(cartId) || !mongoDB.isValidId(productId)) {
            return "ID no válido";
        }
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                return "Carrito no encontrado";
            }

            const productIndex = cart.products.findIndex((p) => p.id._id.toString() === productId.toString());

            if (productIndex !== -1) {
                cart.products.splice(productIndex, 1);
                await cart.save();
                return cart;
            } else {
                return "Producto no encontrado en el carrito";
            }
        } catch (error) {
            throw new Error("Error al eliminar el producto del carrito..");
        }
    };

    updateCartQuantity = async (cartId, productId, quantity) => {
        if (!mongoDB.isValidId(cartId) || !mongoDB.isValidId(productId)) {
            return "ID no válido";
        }
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                return "Carrito no encontrado";
            }

            const productIndex = cart.products.findIndex((p) => p.id._id.toString() === productId.toString());

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = quantity;
                await cart.save();
                return cart; // Devuelve el carrito actualizado
            } else {
                return "Producto no encontrado en el carrito";
            }
        } catch (error) {
            throw new Error("Error al actualizar la cantidad del producto..");
        }
    };

    clearCart = async (cartId) => {
        if (!mongoDB.isValidId(cartId)) {
            return false;
        }
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                return false;
            }
            cart.products = []; // Limpia los productos del carrito
            return await cart.save(); // Guarda los cambios en la base de datos
        } catch (error) {
            throw new Error("Error al limpiar el carrito..");
        }
    };
}

export default CartService;