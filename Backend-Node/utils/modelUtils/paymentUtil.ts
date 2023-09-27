import { InternalServerError, ResourceNotFoundError } from "../../errors/customErrors"
import { ClientNotFound, InternalServer } from "../../errors/errorMessages"
import ClientModel, { DocumentClient } from "../../models/client"


// function to get a client by id
export const getClientById = async (clientId: string) => {
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

export const addPaymentToClient = async (clientId: string) => {
    
}


