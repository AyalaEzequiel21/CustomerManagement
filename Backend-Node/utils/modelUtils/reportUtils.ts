import { errorsPitcher } from "../../errors/errorsPitcher"
import { TypePaymentDto } from "../../schemas/paymentDTOSchema"
import { createPayment } from "../../services/paymentService"

export const processPaymentsReport = async (payments: TypePaymentDto[], reportId: string) => {
    const paymentsIds = []
    try{
        for(const paymentDto of payments){
            const newPayment = await createPayment({
                clientId: paymentDto.clientId,
                amount: paymentDto.amount,
                payment_method: paymentDto.payment_method,
                reportId: reportId
            })
            if(newPayment){
                paymentsIds.push(newPayment._id)
            }
        }
    } catch(error){
        errorsPitcher(error)
    }
    return paymentsIds
}