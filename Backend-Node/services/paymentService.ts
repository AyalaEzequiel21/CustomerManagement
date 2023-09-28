import { BadRequestError, ResourceNotFoundError } from "../errors/customErrors";
import { BadRequest, PaymentNotFound } from "../errors/errorMessages";
import { errorsPitcher } from "../errors/errorsPitcher";
import PaymentModel from "../models/payment";
import { PaymentRegister } from "../schemas/paymentSchema";
import { isEmptyList } from "../utils/existingChecker";
import { addPaymentToClient, getClientById, subtractPaymentToClient, validatePaymentId } from "../utils/modelUtils/paymentUtil";

/////////////////////////
// PAYMENT SERVICE
///////////////////////

export const createPayment = async (newPayment: PaymentRegister) => {    
    const {clientId, amount, payment_method, saleId, reportId} = newPayment // GET ALL ATTRIBUTES TO CREATE A PAYMENT
    try{
        const client = await getClientById(clientId) // GET THE CLIENT OF PAYMENT BY HIS ID 
        if(client){ // IF CLIENT EXISTS THEN CREATED THE PAYMENT
            const paymentCreated = await PaymentModel.create({
                clientId: clientId, 
                amount: amount,
                payment_method: payment_method, 
                saleId: saleId || undefined,
                reportId: reportId || undefined,
            })
            addPaymentToClient(client, paymentCreated) // ADD THE PAYMENT TO CLIENT AND UPDATE HIS BALANCE 
            return paymentCreated // RETURNS THE PAYMENT CREATED
        }
    } catch (error){
        errorsPitcher(error)
    }
}


export const deletePaymentById = async (paymentId: string) => {
    if (validatePaymentId(paymentId)){ // CHECK IF PAYMENTID IS VALID OR RUN AN EXCEPTION
        try {
            const paymentSaved = await PaymentModel.findById(paymentId.toString()) // FIND THE PAYMENT BY HIS ID
            if(paymentSaved){ // CHECK IF EXISTS OR RUN AN EXCEPTION
                 await subtractPaymentToClient(paymentSaved) // REMOVE THE PAYMENT FROM TE CLIENT AND UPDATE HIS BALANCE
                await PaymentModel.findByIdAndDelete(paymentSaved._id) // DELETE THE PAYMENT FROM TO DATA BASE
            } else {
                throw new ResourceNotFoundError(PaymentNotFound)
            }
        } catch (error){
            errorsPitcher(error)
        }
    } else {
        throw new BadRequestError(BadRequest)
    }
}

export const allPayments = async () => {
    try{
        const payments = await PaymentModel.find() //  GET ALL PAYMENTS
        if(isEmptyList(payments)){ // CHECK IF THE RESPONSE IS EMPTY AND RUN AN EXCEPTION
            throw new ResourceNotFoundError(PaymentNotFound)
        }
        return payments // RETURN THE PAYMENTS
    } catch (error){
        errorsPitcher(error)
    }
}

export const getPaymentsByClientId = async (clientId: string) => {
    try {
        const payments = await PaymentModel.find({clientId: clientId}) //  GET ALL PAYMENTS FROM A CLIENT BY HIS ID
        console.log(payments);
        
        if(isEmptyList(payments)){ //CHECK IF THE RESPONSE IS EMPTY  AND RUN AN EXCEPTION
            throw new ResourceNotFoundError(PaymentNotFound)
        }
        return payments // RETURN THE PAYMENTS
    } catch (error){
        errorsPitcher(error)
    }
}