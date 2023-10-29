import mongoose from "mongoose"
import { InternalServerError, ResourceNotFoundError } from "../../errors/customErrors"
import { ClientNotFound, InternalServer } from "../../errors/errorMessages"
import ClientModel, { ClientDocument } from "../../models/client"

// function to get a client by id
export const getClientById = async (clientId: string | mongoose.Types.ObjectId, session: mongoose.ClientSession | null = null) => {
    try{
        const client = await ClientModel.findById(clientId).session(session) // FIND CLIENT BY ID
        if(client && client.is_active){ // IF THE CLIENT EXISTS AND IS ACTIVE
            return client // RETURN THE CLIENT
        }
        throw new ResourceNotFoundError(ClientNotFound)
    }catch (error){
        throw new InternalServerError(InternalServer)
    }
}

export const getClientByName = async (clientName: string, session: mongoose.ClientSession | null = null) => {
    try{
        const client = await ClientModel.findOne({fullname: clientName}).session(session) // FIND CLIENT BY HIS NAME
        if(client && client.is_active){  // IF THE CLIENT EXISTS AND IS ACTIVE
            return client  // RETURN THE CLIENT
        }
        throw new ResourceNotFoundError(ClientNotFound)
    } catch(error){
        throw new InternalServerError(InternalServer)
    }
}

// function to update de client balance
export const updateClientBalance = async (client: ClientDocument, amount: number, isAdd: boolean, session: mongoose.ClientSession | null = null) => {
    isAdd ? client.balance += amount : client.balance -= amount // IF ADD IS TRUE THEN ADD THE AMOUNT TO BALANCE, ELSE SUBTRACT AMOUNT TO BALANCE
    try{
        if(session){
            return client.save({session}) // RETURN THE CLIENT UPDATED
        } else {
            return client.save() // RETURN THE CLIENT UPDATED
        }
    } catch(error){
        throw new InternalServerError(InternalServer)
    }
}

export const addNewPayment = async (client: ClientDocument, paymentId: string | mongoose.Types.ObjectId) => {
    client.payments.push(
        (typeof paymentId == "string") ? 
            new mongoose.Types.ObjectId(paymentId) 
        : 
            paymentId
    )
}