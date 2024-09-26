import { Schema, model } from "mongoose";

const cartsCollection = "carts";

const cartItemSchema = new Schema({
    id: { type: Schema.Types.ObjectId, ref: "products", required: true },
    quantity: { type: Number, required: true },
    _id: false, // Esto para que no aparezca el _id.
});

const cartSchema = new Schema({
    products: [cartItemSchema],
});

cartSchema.pre(/^find/, function(next) {
    this.populate({
        path: "products.id",
        model: "products",
    });
    next();
});

const CartModel = model(cartsCollection, cartSchema);
export default CartModel;