import mongoose from "mongoose"
import { ResourceNotFoundError } from "../../errors/customErrors"
import { ClientNotFound } from "../../errors/errorMessages"
import { ClientDocument } from "../../models/client"
import { PaymentDocument } from "../../models/payment"
import { errorsPitcher } from "../../errors/errorsPitcher"
import { EPaymentMethod } from "../../enums/EPaymentMethod"
import * as clientUtils from "./clientUtils"


// function to get a client by id
export const getClientById = async (clientId: string | mongoose.Types.ObjectId) => {
    try{
        const client = await clientUtils.getClientById(clientId) // FIND CLIENT BY ID
        return client // RETURN THE CLIENT
    }catch (error){
        errorsPitcher(error)
    }
}

export const addPaymentToClient = async (client: ClientDocument, payment: PaymentDocument) => {
    try{
        const updateClient = await clientUtils.updateClientBalance(client, payment.amount, false) // UPDATE THE CLIENT BALANCE
        updateClient.payments.push(payment._id) // ADD THE PAYMENT TO CLIENT PAYMENTS
        await updateClient.save() // SAVE THE CLIENT UPDATED
    } catch(error) {
        errorsPitcher(error)
    }
}

export const subtractPaymentToClient = async (payment: PaymentDocument) => {
    try{
        const client = await clientUtils.getClientById(payment.clientId) // FIND CLIENT BY HIS ID
        if(client){ // IF THE CLIENT EXISTS
            const clientUpdated = await clientUtils.updateClientBalance(client, payment.amount, true) // UPDATE THE CLIENT BALANCE 
            client.payments = client.payments.filter(paymentID => paymentID.toString() !== payment._id.toHexString()) // REMOVE THE PAYMENT FROM CLIENT PAYMENTS
            clientUpdated.save() // SAVE THE CLIENT UPDATED
        }else { // IF NOT EXISTS RUN AN EXCEPTION
            throw new ResourceNotFoundError(ClientNotFound)
        }
    } catch (error){
        errorsPitcher(error)
    }
}

export const validateId = (Id: string): boolean => {
    let response = false 
    if(mongoose.Types.ObjectId.isValid(Id)){
        response = true
    }
    return response
}

export const isValidPaymentMethod = (paymentMethod: string): boolean => {
    return Object.values(EPaymentMethod).includes(paymentMethod as EPaymentMethod)
}