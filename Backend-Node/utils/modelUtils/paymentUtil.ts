import mongoose from "mongoose"
import { InternalServerError, ResourceNotFoundError } from "../../errors/customErrors"
import { ClientNotFound, InternalServer } from "../../errors/errorMessages"
import ClientModel, { ClientDocument } from "../../models/client"
import PaymentModel, { PaymentDocument } from "../../models/payment"
import { errorsPitcher } from "../../errors/errorsPitcher"


// function to get a client by id
export const getClientById = async (clientId: string | mongoose.Types.ObjectId) => {
    try{
        const client = await ClientModel.findById(clientId)
        if(client && client.is_active){
            return client
        }
        throw new ResourceNotFoundError(ClientNotFound)
    }catch (error){
        throw new InternalServerError(InternalServer)
    }
}

export const updateClientBalance = async (client: ClientDocument, amount: number, isAdd: boolean) => {
    isAdd ? client.balance += amount : client.balance -= amount
    return client.save()
}


export const addPaymentToClient = async (client: ClientDocument, payment: PaymentDocument) => {
    try{
        const updateClient = await updateClientBalance(client, payment.amount, false)
        updateClient.payments.push(payment._id)
        await  updateClient.save()
    } catch(error) {
        errorsPitcher(error)
    }
}


