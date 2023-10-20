import mongoose, { Schema, model } from "mongoose";
import { formatDateIso } from "../utils/dateUtils";

export const detailSaleSchema = new Schema({
    product: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
    quantity: {type: Number, min: 0.01,  required: true},
    partialResult: {type: Number}
})

const saleSchema = new Schema({
    sale_date: {type: String, default: formatDateIso(new Date())},
    clientId: {type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true},
    details: [detailSaleSchema],
    totalSale: {type: Number, min: 0.01, required: true},
    payment: {type: mongoose.Schema.Types.ObjectId, ref: "Payment"}
})

const SaleModel = model("Sale", saleSchema, "sales")

export default SaleModel