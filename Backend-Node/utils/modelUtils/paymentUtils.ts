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
export const findClientById = async (clientId: string | mongoose.Types.ObjectId, session: mongoose.ClientSession | null = null) => {
    try{
        const client = await getClientById(clientId, session) // FIND CLIENT BY ID WITH CLIENT UTILS
        return client // RETURN THE CLIENT
    }catch (error){
        errorsPitcher(error)
    }
}

export const addPaymentToClient = async (client: ClientDocument, payment: PaymentDocument, session: mongoose.ClientSession | null = null) => {
    try{
        const updateClient = await updateClientBalance(client, payment.amount, false, session) // UPDATE THE CLIENT BALANCE WITH CLIENT UTILS
        addNewPayment(updateClient, payment._id) // ADD THE PAYMENT TO CLIENT PAYMENTS WITH CLIENT UTILS
        await updateClient.save({session}) // SAVE THE CLIENT UPDATED
    } catch(error) {
        errorsPitcher(error)
    }
}

export const subtractPaymentToClient = async (payment: PaymentDocument, session: mongoose.ClientSession | null = null) => {
    try{
        const client = await getClientById(payment.clientId, session) // FIND CLIENT BY HIS ID WITH CLIENT UTILS
        if(client){ // IF THE CLIENT EXISTS
            const clientUpdated = await updateClientBalance(client, payment.amount, true, session) // UPDATE THE CLIENT BALANCE WITH CLIENT UTILS
            client.payments = client.payments.filter(paymentID => paymentID.toString() !== payment._id.toHexString()) // REMOVE THE PAYMENT FROM CLIENT PAYMENTS
            clientUpdated.save({session}) // SAVE THE CLIENT UPDATED
        }else { // IF NOT EXISTS RUN AN EXCEPTION
            throw new ResourceNotFoundError(ClientNotFound)
        }
    } catch (error){
        errorsPitcher(error)
    }
}

export const processPayment = async (payment: TypePaymentDto, reportId: string|undefined, saleId: string|undefined, session: mongoose.ClientSession | null = null) => {
    try{
        // const options = session ? {session} : {} // SPECIFY IF THE SESSION  EXISTS
        const IDclient = new mongoose.Types.ObjectId(payment.clientId) // CONVERT CLIENTID (STRING) TO OBJECTID

        const newPaymentData = { // CREATE THE PAYMENT DATA 
            clientId: IDclient,
            amount: payment.amount,
            payment_method: payment.payment_method,
            reportId: reportId,
            saleId: saleId
        }
        const newPayment = await PaymentModel.create([newPaymentData], {session})  // CREATE THE PAYMENT WITH PAYMENT DATA AND SESSION IF EXISTS)
        const client = await findClientById(IDclient, session) // GET THE CLIENT BY HIS ID
        if(client && newPayment.length === 1){
            await addPaymentToClient(client, newPayment[0], session) // IF CLIENT AND NEWPAYMENT EXISTS THEN ADD PAYMENT TO HIS REGISTER AND UPDATE THE CLIENT BALANCE
        }
        return newPayment[0]
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