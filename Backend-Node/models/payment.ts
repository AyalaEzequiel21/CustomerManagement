import mongoose, { Schema, model } from "mongoose";
import { EPaymentMethod } from "../enums/EPaymentMethod";
import { formatDateIso } from "../utils/dateUtils";

const paymentSchema = new Schema({
    payment_date: {type: String, default: formatDateIso(new Date())},
    clientId: {type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true}, 
    amount: {type: Number, min: 0.01, required: true},
    payment_method: {type: String, enum: EPaymentMethod, required: true},
    saleId: {type: mongoose.Schema.Types.ObjectId, ref: "Sale"}, 
    reportId: {type: mongoose.Schema.Types.ObjectId, ref: "Report"}
})

const PaymentModel = model("Payment", paymentSchema, "payments")

export default PaymentModel