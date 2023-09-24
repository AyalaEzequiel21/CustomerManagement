import mongoose, { Schema, model } from "mongoose";
import { formatDateIso } from "../utils/dateUtils";

const orderListSchema = new Schema({
    order_date: {type: String, default: formatDateIso(new Date())},
    sales: [{type: mongoose.Schema.Types.ObjectId, ref: "Sale"}],
})

const OrderListModel = model("OrderList", orderListSchema, "orderLists")

export default OrderListModel