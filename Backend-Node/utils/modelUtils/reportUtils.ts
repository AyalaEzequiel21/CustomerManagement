import { errorsPitcher } from "../../errors/errorsPitcher"
import { TypePaymentDto } from "../../schemas/dtos/paymentDTOSchema"
import { createPayment } from "../../services/paymentService"
import { processPayment } from "./paymentUtils"

export const processPaymentsReport = async (payments: TypePaymentDto[], reportId: string) => {
    const paymentsIds = []
    try{
        for(const paymentDto of payments){
            const newPayment = await processPayment(paymentDto, reportId, undefined)
            if(newPayment){
                paymentsIds.push(newPayment._id)
            }
        }
    } catch(error){
        errorsPitcher(error)
    }
    return paymentsIds
}