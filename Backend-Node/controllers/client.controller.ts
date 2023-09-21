import { NextFunction, Request, Response } from "express";
import * as clientService from '../services/clientService'


/////////////////////////
// CLIENT CONTROLLER
///////////////////////


// export const createClient = async (req: Request, res: Response) => {
//     const {fullname, phone, category} = req.body

//     try{
//         const newClient = await ClientModel.create({fullname: fullname, phone: phone, category: category})
//         res.status(201).json({ok: true, data: newClient})
//     } catch( error){
//         res.status(401).json({true: false, message: "Can't create the new client"})
//     }
// }

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