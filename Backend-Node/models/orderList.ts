import mongoose, { Schema, model } from "mongoose";
import { formatDateIso } from "../utils/dateUtils";
import { EOrderSatus } from "../enums/EOrderStatus";

export const detailOrderSchema = new Schema({
    saleId: {type: mongoose.Schema.Types.ObjectId, ref: "Sale", required: true},
    clientName: {type: String, required: true},
    totalSale: {type: Number, min: 0.01}
})

const orderListSchema = new Schema({
    order_date: {type: String, default: formatDateIso(new Date())},
    sales: [detailOrderSchema],
    order_status: {type: String, enum: EOrderSatus, default: EOrderSatus.Pendiente}
})

const OrderListModel = model("OrderList", orderListSchema, "orderLists")

export default OrderListModel