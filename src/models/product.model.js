import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const productCollection = "products";

const productSchema = new Schema({
    category: { type: String, required: true, uppercase: true, trim: true, index: { name: "idx_category" } },
    title: { type: String, required: true, uppercase: true, trim: true, index: { name: "idx_title" } },
    description: { type: String, lowercase: true, required: true, trim: true },
    price: { type: Number, required: true },
    thumbnail: { type: Array, required: true },
    code: { type: String, required: true, lowercase: true, unique: true, trim: true, index: { name: "idx_code" } },
    stock: { type: Number, required: true },
    available: { type: Boolean, default: true },
}, { versionKey: false, toJSON: { virtuals: false }, toObject: { virtuals: false } });

productSchema.index({ category: 1, title: 1 }, { name: "idx_category_title" });
productSchema.plugin(paginate);
const ProductModel = model(productCollection, productSchema);
export default ProductModel;