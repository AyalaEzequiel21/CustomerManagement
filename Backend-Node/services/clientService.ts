
import { BadRequestError, InternalServerError, ResourceAlreadyRegisteredError, ResourceNotFoundError } from "../errors/customErrors"
import { BadRequest, ClientAlreadyRegistered, ClientNotFound, InternalServer } from "../errors/errorMessages"
import ClientModel from "../models/client"
import { ClientMongo, ClientRegister } from "../schemas/clientSchemas"

/////////////////////////
// CLIENT SERVICE
///////////////////////


// function to validate that the same fullname is not registered twice
export const isFullnameRegistered = async (clientFullname: string) => {
    let response = false 
    const clientId = await ClientModel.exists({fullname: clientFullname})
    if(clientId) {
        response = true
    }
    return response
}

// function to validate if a list is not empty
export const isEmptyList = (value: any) => {
    if (Array.isArray(value) || typeof value === 'string') {
      return value.length === 0;
    }
      
    if (value instanceof Map || value instanceof Set) {
      return value.size === 0;
    }
      
    if (typeof value === 'object') {
      return Object.keys(value).length === 0;
    }
      
    return value == null;   
}

//////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////

export const getAllClients = async (inDelivery: boolean) => {
    try{
        const clients = await ClientModel.find() // GET ALL CLIENTS
        if(isEmptyList(clients)){ // IF THE CLIENTS IS EMPTY RUN AN EXCEPTION
            throw new ResourceNotFoundError(ClientNotFound)
            
        } 
        const clientsFiltered = clients.filter(client => client.is_active) // GET ALL ACTIVE CLIENTS
            if (inDelivery){  // IF INDELIVERY IS TRUE RETURN ONLY THE CLIENTS WITH IN_DELIVERY : TRUE 
                    return clientsFiltered.filter(client => client.in_delivery)
            }else {  // ELSE RETURN ALL CLIENTS 
                    return clientsFiltered
            }
    } catch (error){
        throw new InternalServerError(InternalServer)
    }
    
}

export const createClient = async (newClient: ClientRegister) => {
    const {fullname, phone, category, in_delivery} = newClient

    if(await isFullnameRegistered(newClient.fullname)){ // IF FULLNAME HAS ALREADY BEEN REGISTERED RUN AN EXCEPTION
        throw new ResourceAlreadyRegisteredError(ClientAlreadyRegistered)
    } 

    try {
        const client = ClientModel.create({ // CREATE THE NEW CLIENT AND SEND IT
            fullname: fullname, 
            phone: phone, 
            category: category, 
            in_delivery: in_delivery
        })
        return client
    } catch(error){
        throw new BadRequestError(BadRequest)
    }
}

export const updateClient = async (client: ClientMongo) => {
    try{
        const clientSaved = await ClientModel.findById(client._id) // GET THE CLIENT SAVED
        if (clientSaved){ // IF THE CLIENT EXIS THEN UPDATE 
            clientSaved.fullname = client.fullname
            clientSaved.phone = client.phone
            clientSaved.category = client.category
            clientSaved.in_delivery = client.in_delivery
            clientSaved.is_active = client.is_active
        } else {
            throw new ResourceNotFoundError(ClientNotFound)
        }
        const clientUpdated = await clientSaved.save() // SAVE THE UPDATE AND RETURN 
        return clientUpdated
    } catch (error){
        throw new BadRequestError(BadRequest)
    }
}


export const getClientsInactives = async () => {
    try {
        const clientsInactive = await ClientModel.find({is_active: false}) // GET ALL CLIENTS WITH IS_ACTIVE: FALSE
        if(isEmptyList(clientsInactive)){ // IF THE RESPONSE HAVE NOT CLIENTS RUN AN EXCEPTION
            throw new ResourceNotFoundError(ClientNotFound)
        } 
        return clientsInactive
    } catch (error){        
        throw new InternalServerError(InternalServer)
    }
}

export const getClientsByName = async (clientName: string) => {
    try{ 
        const clientsFound = await ClientModel.find({ fullname: { $regex: clientName, $options: 'i' } }) // GET ALL CLIENTS WITH FULLANME CONTAINS CLIENTNAME
        if(isEmptyList(clientsFound)){ // IF CLIENTSFOUND IS EMPTY RUN AN EXCEPTION
            throw new ResourceNotFoundError(ClientNotFound)
        }
        return clientsFound // RETURN THE CLIENTS FOUND
    } catch (error){
        throw new InternalServerError(InternalServer)
    }
}


export const deleteClientById = async (clientId: string) => {
    try {
        const clientSaved = await ClientModel.findById(clientId) // GET THE CLIENT BY THE ID
        if(clientSaved){ // IF EXISTS THE CLIENT THEN MODIFY HIS ATTRIBUTE IS_ACTIVE TO FALSE
            clientSaved.is_active = false
        }else {
            throw new ResourceNotFoundError(ClientNotFound)
        }
        clientSaved.save()
    } catch(error){
        throw new InternalServerError(InternalServer)
    }
}