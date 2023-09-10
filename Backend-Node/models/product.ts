import { Schema, model } from "mongoose";

const productSchema = new Schema({
    name: {type: String, unique: true, require: true},
    decription: {type: String},
    price_client: {type: Number, min: 0.01, require: true},
    price_no_client: {type: Number, min: 0.01, require: true},
    is_active: {type: Boolean, default: true}
})

const ProductModel = model("Product", productSchema, "products")

export default ProductModel