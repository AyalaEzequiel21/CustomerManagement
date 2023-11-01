
import { ECategory } from "../enums/ECategory"
import { BadRequestError, ResourceAlreadyRegisteredError, ResourceNotFoundError } from "../errors/customErrors"
import { BadRequest, ClientAlreadyRegistered, ClientNotFound, PhoneAlreadyRegistered } from "../errors/errorMessages"
import { errorsPitcher } from "../errors/errorsPitcher"
import ClientModel from "../models/client"
import { ClientMongo, ClientRegister } from "../schemas/clientSchemas"
import { existsEntity, isEmptyList } from "../utils/existingChecker"

/////////////////////////
// CLIENT SERVICE
///////////////////////


export const getAllClients = async (inDelivery: boolean) => {
    try{
        const clients = await ClientModel.find({is_active: true}) // GET ALL ACTIVE CLIENTS
        if(isEmptyList(clients)){ // IF THE CLIENTS IS EMPTY RUN AN EXCEPTION
            throw new ResourceNotFoundError(ClientNotFound)
        } 

        if (inDelivery){  // IF INDELIVERY IS TRUE RETURN ONLY THE CLIENTS WITH IN_DELIVERY : TRUE 
                return clients.filter(client => client.in_delivery)
        }
        return clients // ELSE RETURN ALL ACTIVES CLIENTS
    } catch (error){
        errorsPitcher(error)
    }
    
}

export const createClient = async (newClient: ClientRegister) => {
    const {fullname, phone, category, in_delivery} = newClient
    try{
        if(await existsEntity(ClientModel,"fullname", fullname)){ // IF FULLNAME HAS ALREADY BEEN REGISTERED RUN AN EXCEPTION
            throw new ResourceAlreadyRegisteredError(ClientAlreadyRegistered)
        } 
        if(await existsEntity(ClientModel,"phone", phone)){
            throw new ResourceAlreadyRegisteredError(PhoneAlreadyRegistered) // IF PHONE HAS ALREADY BEEN REGISTERED RUN AN EXCEPTION
        }
        const client = await ClientModel.create({ // CREATE THE NEW CLIENT 
            fullname: fullname, 
            phone: phone, 
            category: category, 
            in_delivery: in_delivery
        })
        if(!client){ // IF CANNOT SAVE THE CLIENT RUN AN EXCEPTION
            throw new BadRequestError(BadRequest)
        }
        return client // ELSE RETURN THE CLIENT
    } catch(error){
        errorsPitcher(error)
    }
}

export const updateClient = async (client: ClientMongo) => {
    try{
        const clientSaved = await ClientModel.findById(client._id) // GET THE CLIENT SAVED
        if (!clientSaved){ // IF NOT EXISTS THE CLIENT RUN AN EXCEPTION
            throw new ResourceNotFoundError(ClientNotFound)
        } 
        clientSaved.fullname = client.fullname // ELSE UPDATE THE CLIENT
        clientSaved.phone = client.phone
        if(client.balance !== undefined) clientSaved.balance = client.balance
        clientSaved.category = client.category
        clientSaved.in_delivery = client.in_delivery
        clientSaved.is_active = client.is_active
        const clientUpdated = await clientSaved.save() // SAVE THE UPDATE AND RETURN 
        if(!clientUpdated){
            throw new BadRequestError(BadRequest)
        }
        return clientUpdated
    } catch (error){
        errorsPitcher(error)
    }
}


export const getClientsInactives = async () => {
    try {
        const clientsInactive = await ClientModel.find({is_active: false}) // GET ALL CLIENTS WITH IS_ACTIVE: FALSE      
        if(isEmptyList(clientsInactive)){ // IF THE RESPONSE HAVE NOT CLIENTS RUN AN EXCEPTION
            throw new ResourceNotFoundError(ClientNotFound)
        } 
        return clientsInactive // RETURN ALL INACTIVES CLIENT 
    } catch (error){        
        errorsPitcher(error)
    }
}

export const getClientsByName = async (clientName: string) => {
    try{ 
        const clientsFound = await ClientModel.find({ fullname: { $regex: clientName, $options: 'i' }, is_active: true }) // GET ALL CLIENTS WITH FULLANME CONTAINS CLIENTNAME
        if(isEmptyList(clientsFound)){ // IF CLIENTSFOUND IS EMPTY RUN AN EXCEPTION
            throw new ResourceNotFoundError(ClientNotFound)
        }
        return clientsFound // RETURN THE CLIENTS FOUND
    } catch (error){        
        errorsPitcher(error)
    }
}

export const getClientsByCategory = async (category: string) => {
    if(Object.values(ECategory).some((enumCategory) => enumCategory === category)){ // CHECK IF CATEGORY IS VALID
        try{        
            const clientsFound = await ClientModel.find({category: category, is_active: true}) // GET ALL CLIENTS WITH THE SAME CATEGORY AND ACTIVE
            if (isEmptyList(clientsFound)){ // IF CLIENTSFOUND IS EMPTY RUN AN EXCEPTION
                throw new ResourceNotFoundError(ClientNotFound)
            }
            return clientsFound // RETURNS THE CLIENTS FOUND
        } catch (error){
            errorsPitcher(error)
        }
    }
    throw new BadRequestError(BadRequest)
}

export const deleteClientById = async (clientId: string) => {
    try {
        const clientSaved = await ClientModel.findById(clientId) // GET THE CLIENT BY THE ID
        if(!clientSaved || !clientSaved.is_active){ // IF NOT EXISTS THE CLIENT RUN AN EXCEPTION
            throw new ResourceNotFoundError(ClientNotFound)
        }
        clientSaved.is_active = false // ELSE CHENGE THE STATUS TO INACTIVE
        clientSaved.save() // SAVE THE CLIENT INACTIVE
    } catch(error){
        errorsPitcher(error)
    }
}