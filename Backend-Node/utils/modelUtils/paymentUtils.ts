import mongoose from "mongoose"
import { ResourceNotFoundError } from "../../errors/customErrors"
import { ClientNotFound } from "../../errors/errorMessages"
import { ClientDocument } from "../../models/client"
import PaymentModel, { PaymentDocument } from "../../models/payment"
import { errorsPitcher } from "../../errors/errorsPitcher"
import { EPaymentMethod } from "../../enums/EPaymentMethod"
import { TypePaymentDto } from "../../schemas/dtos/paymentDTOSchema"
import { addNewPayment, getClientById, updateClientBalance } from "./clientUtils" // CLIENT UTILS


// function to get a client by id
export const findClientById = async (clientId: string | mongoose.Types.ObjectId) => {
    try{
        const client = await getClientById(clientId) // FIND CLIENT BY ID WITH CLIENT UTILS
        return client // RETURN THE CLIENT
    }catch (error){
        errorsPitcher(error)
    }
}

export const addPaymentToClient = async (client: ClientDocument, payment: PaymentDocument) => {
    try{
        const updateClient = await updateClientBalance(client, payment.amount, false) // UPDATE THE CLIENT BALANCE WITH CLIENT UTILS
        addNewPayment(updateClient, payment._id) // ADD THE PAYMENT TO CLIENT PAYMENTS WITH CLIENT UTILS
        await updateClient.save() // SAVE THE CLIENT UPDATED
    } catch(error) {
        errorsPitcher(error)
    }
}

export const subtractPaymentToClient = async (payment: PaymentDocument) => {
    try{
        const client = await getClientById(payment.clientId) // FIND CLIENT BY HIS ID WITH CLIENT UTILS
        if(client){ // IF THE CLIENT EXISTS
            const clientUpdated = await updateClientBalance(client, payment.amount, true) // UPDATE THE CLIENT BALANCE WITH CLIENT UTILS
            client.payments = client.payments.filter(paymentID => paymentID.toString() !== payment._id.toHexString()) // REMOVE THE PAYMENT FROM CLIENT PAYMENTS
            clientUpdated.save() // SAVE THE CLIENT UPDATED
        }else { // IF NOT EXISTS RUN AN EXCEPTION
            throw new ResourceNotFoundError(ClientNotFound)
        }
    } catch (error){
        errorsPitcher(error)
    }
}

export const processPayment = async (payment: TypePaymentDto, reportId: string|undefined, saleId: string|undefined) => {
    try{
        const newPayment = await PaymentModel.create({  // CREATE THE PAYMENT
        clientId: payment.clientId,
        amount: payment.amount,
        payment_method: payment.payment_method,
        reportId: reportId,
        saleId: saleId
        })
        const client = await findClientById(newPayment.clientId) // GET THE CLIENT BY HIS ID
        if(client){
            await addPaymentToClient(client, newPayment) // IF CLIENT EXISTS THEN ADD PAYMENT TO HIS REGISTER AND UPDATE THE CLIENT BALANCE
        }
        return newPayment
    }catch(error){
        errorsPitcher(error)
    }
}

export const validateId = (Id: string): boolean => { // FUNCTION FOR CHECK IF AN ID IS VALID
    let response = false 
    if(mongoose.Types.ObjectId.isValid(Id)){
        response = true
    }
    return response
}

export const isValidPaymentMethod = (paymentMethod: string): boolean => { // FUNCTION FOR CHECK IF THE PAYMENT METHOD IS VALID
    return Object.values(EPaymentMethod).includes(paymentMethod as EPaymentMethod)
}