import mongoose, { Schema, model } from "mongoose";
import { EPaymentMethod } from "../enums/EPaymentMethod";

const paymentSchema = new Schema({
    payment_date: {type: Date, default: Date.now()},
    client: {type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true}, 
    amount: {type: Number, min: 0.01, required: true},
    payment_method: {type: String, enum: EPaymentMethod, required: true},
    sale: {type: mongoose.Schema.Types.ObjectId, ref: "Sale"}, 
    report: {type: mongoose.Schema.Types.ObjectId, ref: "Report"}
})

const PaymentModel = model("Payment", paymentSchema, "payments")

export default PaymentModel