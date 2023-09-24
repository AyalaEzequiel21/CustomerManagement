import mongoose, { Schema, model } from "mongoose";
import { formatDate } from "../utils/dateUtils";

const orderListSchema = new Schema({
    order_date: {type: Date, default: formatDate(new Date())},
    sales: [{type: mongoose.Schema.Types.ObjectId, ref: "Sale"}],
})

const OrderListModel = model("OrderList", orderListSchema, "orderLists")

export default OrderListModel