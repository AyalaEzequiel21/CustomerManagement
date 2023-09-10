import mongoose, { Schema, model } from "mongoose";

const orderListSchema = new Schema({
    order_date: {type: Date, default: Date.now()},
    sales: [{type: mongoose.Schema.Types.ObjectId, ref: "Sale"}],
})

const OrderListModel = model("OrderList", orderListSchema, "orderLists")

export default OrderListModel