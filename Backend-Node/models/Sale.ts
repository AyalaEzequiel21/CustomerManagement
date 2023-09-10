import mongoose, { Schema, model } from "mongoose";

const detailSaleSchema = new Schema({
    product: {type: mongoose.Schema.Types.ObjectId, ref: "Product", require: true},
    quantity: {type: Number, min: 0.01,  require: true}
})

const saleSchema = new Schema({
    sale_date: {type: Date, default: Date.now()},
    client: {type: mongoose.Schema.Types.ObjectId, ref: "Client", require: true},
    details: [detailSaleSchema],
    totalSale: {type: Number, min: 0.01, require: true},
    payment: {type: mongoose.Schema.Types.ObjectId, ref: "Payment"}
})

const SaleModel = model("Sale", saleSchema, "sales")

export default SaleModel