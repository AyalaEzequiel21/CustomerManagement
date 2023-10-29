import mongoose from "mongoose"
import { errorsPitcher } from "../../errors/errorsPitcher"
import { TypePaymentDto } from "../../schemas/dtos/paymentDTOSchema"
import { processPayment } from "./paymentUtils"

export const processPaymentsReport = async (payments: TypePaymentDto[], reportId: string, session: mongoose.ClientSession | null = null) => {
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
        errorsPitcher(error)
    }
}