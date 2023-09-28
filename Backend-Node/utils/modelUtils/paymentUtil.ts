import mongoose from "mongoose"
import { InternalServerError, ResourceNotFoundError } from "../../errors/customErrors"
import { ClientNotFound, InternalServer } from "../../errors/errorMessages"
import ClientModel, { ClientDocument } from "../../models/client"
import { PaymentDocument } from "../../models/payment"
import { errorsPitcher } from "../../errors/errorsPitcher"


// function to get a client by id
export const getClientById = async (clientId: string | mongoose.Types.ObjectId) => {
    try{
        const client = await ClientModel.findById(clientId) // FIND CLIENT BY ID
        if(client && client.is_active){ // IF THE CLIENT EXISTS AND IS ACTIVE
            return client // RETURN THE CLIENT
        }
        throw new ResourceNotFoundError(ClientNotFound)
    }catch (error){
        throw new InternalServerError(InternalServer)
    }
}

export const updateClientBalance = async (client: ClientDocument, amount: number, isAdd: boolean) => {
    isAdd ? client.balance += amount : client.balance -= amount // IF ADD IS TRUE THEN ADD THE AMOUNT TO BALANCE, ELSE SUBTRACT AMOUNT TO BALANCE
    return client.save() // RETURN THE CLIENT UPDATED
}


export const addPaymentToClient = async (client: ClientDocument, payment: PaymentDocument) => {
    try{
        const updateClient = await updateClientBalance(client, payment.amount, false) // UPDATE THE CLIENT BALANCE
        updateClient.payments.push(payment._id) // ADD THE PAYMENT TO CLIENT PAYMENTS
        await  updateClient.save() // SAVE THE CLIENT UPDATED
    } catch(error) {
        errorsPitcher(error)
    }
}

export const subtractPaymentToClient = async (payment: PaymentDocument) => {
    try{
        const client = await getClientById(payment.clientId) // FIND CLIENT BY HIS ID
        if(client){ // IF THE CLIENT EXISTS
            const clientUpdated = await updateClientBalance(client, payment.amount, true) // UPDATE THE CLIENT BALANCE 
            client.payments = client.payments.filter(paymentID => paymentID.toString() !== payment._id.toHexString()) // REMOVE THE PAYMENT FROM CLIENT PAYMENTS
            clientUpdated.save() // SAVE THE CLIENT UPDATED
        }else { // IF NOT EXISTS RUN AN EXCEPTION
            throw new ResourceNotFoundError(ClientNotFound)
        }
    } catch (error){
        errorsPitcher(error)
    }
}

export const validatePaymentId = (paymentId: string) => {
    let response = false 
    if(mongoose.Types.ObjectId.isValid(paymentId)){
        response = true
    }
    return response
}

