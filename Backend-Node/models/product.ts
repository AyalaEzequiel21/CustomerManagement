import { Schema, model } from "mongoose";

const productSchema = new Schema({
    productName: {type: String, unique: true, required: true},
    price_cat_1: {type: Number, min: 0.01, required: true},
    price_cat_2: {type: Number, min: 0.01, required: true},
    is_active: {type: Boolean, default: true}
})

const ProductModel = model("Product", productSchema, "products")

export default ProductModel