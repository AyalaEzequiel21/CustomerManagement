import mongoose, { Schema, model } from "mongoose";
import { ECategory } from "../enums/ECategory";
import { formatDate } from "../utils/dateUtils";

const clientSchema = new Schema({
    fullname: {type: String, unique: true, required: true},
    phone: {type: String, required: true},
    register_date: {type: Date, default: formatDate(new Date())},
    category: {type: String, enum: ECategory, required: true},
    balance: {type: Number, default: 0.0},
    sales: [{type: mongoose.Schema.Types.ObjectId, ref: "Sale", default: new Array}],
    payments: [{type: mongoose.Schema.Types.ObjectId, ref: "Payment", default: new Array}],
    in_delivery: {type: Boolean},
    is_active: {type: Boolean, default: true}
})

const ClientModel = model("Client", clientSchema, "clients")

export default ClientModel