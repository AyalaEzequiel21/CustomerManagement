import { errorsPitcher } from "../errors/errorsPitcher";
import PaymentModel from "../models/payment";
import { PaymentRegister } from "../schemas/paymentSchema";
import { getClientById } from "./clientService";

/////////////////////////
// PAYMENT SERVICE
///////////////////////

export const validateIds = async (clientId: string) => {
    try{
        // const client = await existsClient(clientId)
    }    
    catch(error){
        errorsPitcher(error)
    }
}


//////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////

export const createPayment = async (newPayment: PaymentRegister) => {    
    const {clientId, amount, payment_method, saleId, reportId} = newPayment
    try{
        const client = await getClientById(clientId)
        if(client){
            const paymentCreated = PaymentModel.create({
                clientId: clientId, 
                amount: amount,
                payment_method: payment_method, 
                saleId: saleId ? saleId : undefined,
                reportId: reportId ? reportId : undefined,
            })
            client.balance = client.balance - amount
            client.payments.push((await paymentCreated)._id)
            client.save()
            return paymentCreated
        }
    } catch (error){
        errorsPitcher(error)
    }
}