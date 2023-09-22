import { NextFunction, Request, Response } from "express";
import * as clientService from '../services/clientService'


/////////////////////////
// CLIENT CONTROLLER
///////////////////////


export const registerClient = async (req: Request, res: Response, next: NextFunction) => {
    const clientFromRequest = req.body // GET THE CLIENT TO CREATE FROM REQUEST
    try{
        const newClient = await clientService.createClient(clientFromRequest) // CREATE THE NEW CLIENT WITH AUTHSERVICE 
        res.status(201).json({ok: true, data: newClient}) // RETURN STATUS 200 AND THE NEW CLIENT IN THE DATA
    } catch( error){
        next(error)
    }
}

export const updateClient = async (req: Request, res: Response, next: NextFunction) => {
    const client = req.body // GET THE CLIENT TO UPDATE FROM REQUEST
    try {
        const clientUpdated = await clientService.updateClient(client) // UPDATE THE CLIENT WITH AUTHSERVICE
        res.status(200).json({ok: true, data: clientUpdated}) // RETURN STATUS 200 AND THE CLIENT UPDATED
    } catch(error) {
        next(error)
    }
}

export const getAllClients = async (req: any, res: Response, next: NextFunction) => {
    const inDelivery: boolean = req.filterClientsInDelivery
    try{
        const clients = await clientService.getAllClients(inDelivery)
        res.status(200).json({ok: true, data: clients})
    }
    catch(error){
        next(error)
    }
}

export const deleteClient = async (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.params.id
    try {
        await clientService.deleteClientById(clientId)
        res.status(204).json({ok: true})
    } catch (error){
        next(error)
    }
}