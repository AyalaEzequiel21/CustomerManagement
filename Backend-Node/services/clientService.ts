/////////////////////////
// CLIENT SERVICE
///////////////////////

import { ResourceNotFoundError } from "../errors/customErrors"
import { ClientNotFound } from "../errors/errorMessages"
import ClientModel from "../models/client"

// function to validate that the same fullname is not registered twice
export const isAnvailableName = async (clientFullname: string) => {
    let response = false 
    const clientId = await ClientModel.exists({fullname: clientFullname})
    if(clientId) {
        response = true
    }
    return response
}

export const getAllClients = async (inDelivery: boolean) => {
    const clients = await ClientModel.find() // GET ALL CLIENTS
    if(clients.length > 0 ){ // IF THE CLIENTS LENGTH IS LESS THAT 0 RN AN EXCEPTION
        if (inDelivery){  // IF INDELIVERY IS TRUE RETURN ONLY THE CLIENTS WITH IN_DELIVERY : TRUE 
                return clients.filter(client => client.in_delivery)
           }else {  // ELSE RETURN ALL CLIENTS 
                return clients
           }
    } else {
        throw new ResourceNotFoundError(ClientNotFound)
    }
}
