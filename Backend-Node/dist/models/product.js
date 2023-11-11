"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    productName: { type: String, unique: true, required: true },
    price_cat_1: { type: Number, min: 0.01, required: true },
    price_cat_2: { type: Number, min: 0.01, required: true },
    is_active: { type: Boolean, default: true }
});
const ProductModel = (0, mongoose_1.model)("Product", productSchema, "products");
exports.default = ProductModel;
