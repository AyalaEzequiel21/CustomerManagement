import mongoose, { Schema, model } from "mongoose";
import { ECategory } from "../enums/ECategory";

const clientSchema = new Schema({
    fullname: {type: String, unique: true, require: true},
    phone: {type: String, unique:true, require: true},
    register_date: {type: Date, default: Date.now()},
    category: {type: String, enum: ECategory, require: true},
    balance: {type: Number, default: 0.0},
    sales: [{type: mongoose.Schema.Types.ObjectId, ref: "Sale", default: new Array}],
    payments: [{type: mongoose.Schema.Types.ObjectId, ref: "Payment", default: new Array}],
    is_active: {type: Boolean, default: true}
})

const ClientModel = model("Client", clientSchema, "clients")

export default ClientModel