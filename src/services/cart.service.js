import CartRepository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";

class CartService {

    constructor() {
        this.cartRepository = new CartRepository();
        this.productRepository = new ProductRepository();
    }

    getCarts = async() => {
        try {
            const carts = await this.cartRepository.getCarts();
            return carts;
        } catch (error) {
            throw new Error("Error al obtener los carritos..");
        }
    };

    addCart = async() => {
        try {
            return await this.cartRepository.createCart({ products: [] });
        } catch (error) {
            throw new Error("Error al agregar un carrito..");
        }
    };

    getCartById = async(id) => {
        try {
            const cart = await this.cartRepository.getCartById(id);
            return cart;
        } catch (error) {
            throw new Error("Error al obtener el carrito..");
        }
    };

    deleteCartById = async(id) => {
        try {
            return await this.cartRepository.deleteCart(id);
        } catch (error) {
            throw new Error("Error al eliminar el carrito..");
        }
    };

    updateCart = async (id, updateData) => {
        try {
            const cart = await this.cartRepository.getCartById(id);
            if (!cart) {
                return "Ese Id no existe";
            }

            cart.products = updateData.products;
            const updatedCart = await this.cartRepository.updateCart(id, cart);

            return updatedCart;
        } catch (error) {
            throw new Error("Error al editar el carrito: " + error.message);
        }
    };

    addProductToCart = async (cartId, productId) => {
        try {
            const cart = await this.cartRepository.getCartById(cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            const product = await this.productRepository.getProductById(productId);
            if (!product) {
                throw new Error("Producto no encontrado");
            }

            const productInCart = cart.products.find((p) => p.id._id.toString() === productId.toString());

            if (productInCart) {
                productInCart.quantity += 1;
                await this.cartRepository.updateCart(cartId, cart);
                return "Cantidad incrementada";
            } else {
                if (product.stock > 0) {
                    cart.products.push({ id: product._id, quantity: 1 });
                    await this.cartRepository.updateCart(cartId, cart);
                    return "Producto agregado";
                } else {
                    throw new Error("No hay stock disponible para agregar el producto.");
                }
            }
        } catch (error) {
            throw new Error("Error al agregar el producto al carrito: " + error.message);
        }
    };

    deleteProductFromCart = async (cartId, productId) => {
        try {
            const cart = await this.cartRepository.getCartById(cartId);
            if (!cart) {
                return "Carrito no encontrado";
            }

            const productIndex = cart.products.findIndex((p) => p.id._id.toString() === productId.toString());

            if (productIndex !== -1) {
                cart.products.splice(productIndex, 1);
                return await this.cartRepository.updateCart(cartId, cart);
            } else {
                return "Producto no encontrado en el carrito";
            }
        } catch (error) {
            throw new Error("Error al eliminar el producto del carrito..");
        }
    };

    updateCartQuantity = async (cartId, productId, quantity) => {
        try {
            const cart = await this.cartRepository.getCartById(cartId);

            if (!cart) {
                return "Carrito no encontrado";
            }

            const productIndex = cart.products.findIndex((p) => p.id._id.toString() === productId.toString());

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = quantity;
                return await this.cartRepository.updateCart(cartId, cart);
            } else {
                return "Producto no encontrado en el carrito";
            }
        } catch (error) {
            throw new Error("Error al actualizar la cantidad del producto..");
        }
    };

    clearCart = async (cartId) => {
        try {
            const cart = await this.cartRepository.getCartById(cartId);
            if (!cart) {
                return false;
            }
            cart.products = [];
            return await this.cartRepository.updateCart(cartId, cart);
        } catch (error) {
            throw new Error("Error al limpiar el carrito..");
        }
    };
}

export default CartService;