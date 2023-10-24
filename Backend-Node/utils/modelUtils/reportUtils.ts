import mongoose from "mongoose"
import { errorsPitcher } from "../../errors/errorsPitcher"
import { TypePaymentDto } from "../../schemas/dtos/paymentDTOSchema"
import * as paymentUtils from "./paymentUtils"

export const processPaymentsReport = async (payments: TypePaymentDto[], reportId: string) => {
    const paymentsIds: mongoose.Types.ObjectId[]   = [] // created an array for add the payments
    try{
        for(const paymentDto of payments){ // all paymentsDto are processed 
            const newPayment = await paymentUtils.processPayment(paymentDto, reportId, undefined)
            if(newPayment){
                paymentsIds.push(new mongoose.Types.ObjectId(newPayment._id))
            }
        }
        return paymentsIds
    } catch(error){
        errorsPitcher(error)
    }
}