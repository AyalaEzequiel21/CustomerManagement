import mongoose, { Document, Schema, model } from "mongoose";
import { ECategory } from "../enums/ECategory";
import { formatDateIso } from "../utils/dateUtils";

const clientSchema = new Schema({
    fullname: {type: String, unique: true, required: true},
    phone: {type: String, unique: true, required: true},
    register_date: {type: String, default: formatDateIso(new Date())},
    category: {type: String, enum: ECategory, required: true},
    balance: {type: Number, default: 0.0},
    sales: [{type: mongoose.Schema.Types.ObjectId, ref: "Sale", default: new Array}],
    payments: [{type: mongoose.Schema.Types.ObjectId, ref: "Payment", default: new Array}],
    in_delivery: {type: Boolean},
    is_active: {type: Boolean, default: true}
})

const ClientModel = model("Client", clientSchema, "clients")


export interface ClientDocument extends Document {
    _id: mongoose.Types.ObjectId,
    fullname: string,
    phone: string,
    register_date: string,
    category: string,
    balance: number,
    sales: Array<mongoose.Types.ObjectId>,
    payments: Array<mongoose.Types.ObjectId>,
    in_delivery?: boolean | undefined,
    is_active: boolean | undefined
}


export default ClientModel