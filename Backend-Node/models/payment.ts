import mongoose, { Schema, model } from "mongoose";
import { EPaymentMethod } from "../enums/EPaymentMethod";

const paymentSchema = new Schema({
    payment_date: {type: Date, default: Date.now()},
    client: {type: mongoose.Schema.Types.ObjectId, ref: "Client", require: true}, 
    amount: {type: Number, min: 0.01, require: true},
    payment_method: {type: String, enum: EPaymentMethod, require: true},
    sale: {type: mongoose.Schema.Types.ObjectId, ref: "Sale"}, 
    report: {type: mongoose.Schema.Types.ObjectId, ref: "Report"}
})

const PaymentModel = model("Payment", paymentSchema, "payments")

export default PaymentModel