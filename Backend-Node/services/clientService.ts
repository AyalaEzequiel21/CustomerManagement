
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

        return clients
    } catch (error){
        errorsPitcher(error)
    }
    
}

export const createClient = async (newClient: ClientRegister) => {
    const {fullname, phone, category, in_delivery} = newClient

    if(await existsEntity(ClientModel,"fullname", fullname)){ // IF FULLNAME HAS ALREADY BEEN REGISTERED RUN AN EXCEPTION
        throw new ResourceAlreadyRegisteredError(ClientAlreadyRegistered)
    } 
    if(await existsEntity(ClientModel,"phone", phone)){
        throw new ResourceAlreadyRegisteredError(PhoneAlreadyRegistered) // IF PHONE HAS ALREADY BEEN REGISTERED RUN AN EXCEPTION
    }
    try {
        const client = await ClientModel.create({ // CREATE THE NEW CLIENT AND SEND IT
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
            if(client.balance !== undefined) clientSaved.balance = client.balance
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
        errorsPitcher(error)
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
        errorsPitcher(error)
    }
}

export const getClientsByCategory = async (category: string) => {
    if(Object.values(ECategory).some((enumCategory) => enumCategory === category)){ // CHECK IF CATEGORY IS VALID
        try{        
            const clientsFound = await ClientModel.find({category: category}) // GET ALL CLIENTS WITH THE SAME CATEGORY
            if (isEmptyList(clientsFound)){
                throw new ResourceNotFoundError(ClientNotFound)
            }
            return clientsFound // RETURNS THE CLIENTS FOUND
        } catch (error){
            errorsPitcher(error)
        }
    }else{
        throw new BadRequestError(BadRequest)
    }
}

export const deleteClientById = async (clientId: string) => {
    try {
        const clientSaved = await ClientModel.findById(clientId) // GET THE CLIENT BY THE ID
        if(clientSaved && clientSaved.is_active){ // IF EXISTS THE CLIENT THEN MODIFY HIS ATTRIBUTE IS_ACTIVE TO FALSE
            clientSaved.is_active = false
        }else {
            throw new ResourceNotFoundError(ClientNotFound)
        }
        clientSaved.save()
    } catch(error){
        errorsPitcher(error)
    }
}