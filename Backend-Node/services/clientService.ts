
import { ECategory } from "../enums/ECategory"
import { BadRequestError, ResourceAlreadyRegisteredError, ResourceNotFoundError } from "../errors/customErrors"
import { BadRequest, ClientAlreadyRegistered, ClientNotFound, PhoneAlreadyRegistered } from "../errors/errorMessages"
import { errorsPitcher } from "../errors/errorsPitcher"
import ClientModel from "../models/client"
import { ClientMongo, ClientRegister } from "../schemas/clientSchemas"
import { isEmptyList } from "../utils/emptyValidateUtils"

/////////////////////////
// CLIENT SERVICE
///////////////////////

export const existsClient = async (clientId: string) => {
    let response = false
    const client = await ClientModel.exists({_id: clientId})
    if (client){
        response = true
    }
    return response
}

// function to validate that the same fullname is not registered twice
export const isFullnameRegistered = async (clientFullname: string) => {
    let response = false 
    const clientId = await ClientModel.exists({fullname: clientFullname})
    if(clientId) {
        response = true
    }
    return response
}

// function to validate that the same phone is not registered twice
export const isPhoneRegistered = async (phone: string) => {
    let response = false 
    const clientId = await ClientModel.exists({phone: phone})
    if(clientId) {
        response = true
    }
    return response
}


//////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////

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

    if(await isFullnameRegistered(fullname)){ // IF FULLNAME HAS ALREADY BEEN REGISTERED RUN AN EXCEPTION
        throw new ResourceAlreadyRegisteredError(ClientAlreadyRegistered)
    } 
    if(await isPhoneRegistered(phone)){
        throw new ResourceAlreadyRegisteredError(PhoneAlreadyRegistered) // IF PHONE HAS ALREADY BEEN REGISTERED RUN AN EXCEPTION
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

export const getClientById = async (clientId: string) => {
    try{
        const client = ClientModel.findById(clientId) // FIND THE CLIENT BY HIS ID
        if(!client) { // IF NOT EXISTS RUN AN EXECEPTION
            throw new ResourceNotFoundError(ClientNotFound)
        }
        return client // ELSE RETURNS THE CLIENT
    } catch (error) {
        errorsPitcher(error)
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