import { Request, Response } from "express";
import ClientModel from "../models/client";

//
    // CREATE THE NEW CLIENT
//
export const createClient = async (req: Request, res: Response) => {
    const {fullname, phone, category} = req.body

    try{
        const newClient = await ClientModel.create({fullname: fullname, phone: phone, category: category})
        res.status(201).json({ok: true, data: newClient})
    } catch( error){
        res.status(401).json({true: false, message: "Can't create the new client"})
    }
}

export const getAllClients = async (req: Request, res: Response) => {
    try{
        const clients = await ClientModel.find()
        res.status(200).json({ok: true, data: clients})
    }
    catch(error){
        res.status(404).json({true: false, message: "Clients not found"})
    }
}