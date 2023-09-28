import { errorsPitcher } from "../errors/errorsPitcher";
import PaymentModel from "../models/payment";
import { PaymentRegister } from "../schemas/paymentSchema";
import { addPaymentToClient, getClientById } from "../utils/modelUtils/paymentUtil";

/////////////////////////
// PAYMENT SERVICE
///////////////////////

export const createPayment = async (newPayment: PaymentRegister) => {    
    const {clientId, amount, payment_method, saleId, reportId} = newPayment
    try{
        const client = await getClientById(clientId)
        if(client){
            const paymentCreated = await PaymentModel.create({
                clientId: clientId, 
                amount: amount,
                payment_method: payment_method, 
                saleId: saleId || undefined,
                reportId: reportId || undefined,
            })
            addPaymentToClient(client, paymentCreated)
            return paymentCreated
        }
    } catch (error){
        errorsPitcher(error)
    }
}