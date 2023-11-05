import mongoose from "mongoose"
import { TypePaymentDto } from "../../schemas/dtos/paymentDTOSchema"
import { processPayment } from "./paymentUtils"

export const processPaymentsReport = async (payments: TypePaymentDto[], reportId: mongoose.Types.ObjectId, session: mongoose.ClientSession | null = null) => {
    const paymentsIds: mongoose.Types.ObjectId[]   = [] // created an array for add the payments
    try{
        for(const paymentDto of payments){ // all paymentsDto are processed 
            const newPayment = await processPayment(paymentDto, reportId, undefined, session) // WITH PAYMENT UTILS
            if(newPayment){
                paymentsIds.push(new mongoose.Types.ObjectId(newPayment._id))
            }
        }
        return paymentsIds
    } catch(error){
        throw error
    }
}