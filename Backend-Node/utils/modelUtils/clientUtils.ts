import mongoose from "mongoose"
import { InternalServerError, ResourceNotFoundError } from "../../errors/customErrors"
import { ClientNotFound, InternalServer } from "../../errors/errorMessages"
import ClientModel, { ClientDocument } from "../../models/client"

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

// function to update de client balance
export const updateClientBalance = async (client: ClientDocument, amount: number, isAdd: boolean) => {
    isAdd ? client.balance += amount : client.balance -= amount // IF ADD IS TRUE THEN ADD THE AMOUNT TO BALANCE, ELSE SUBTRACT AMOUNT TO BALANCE
    return client.save() // RETURN THE CLIENT UPDATED
}
