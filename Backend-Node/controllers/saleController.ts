import { NextFunction, Request, Response } from "express"
import * as saleService from "../services/saleService"

/////////////////////////
// SALE CONTROLLER
///////////////////////

export const getAllSales = async (req: any, res: Response, next: NextFunction) => {
    const inDelivery = req.filterDelivery // CHECK IF THE FILTER IN_DELIVERY IS ACTIVE
    try{
        const sales = await saleService.getSales(inDelivery) // FIND ALL SALES WITH SALESERVICE
        res.status(200).json({ok: true, data: sales}) // RETURNS STATUS 200 AND THE SALES
    }catch (error){
        next(error)
    }
}

export const getSalesByClientName = async (req: any, res: Response, next: NextFunction) => {
    const inDelivery = req.filterDelivery // CHECK IF THE FILTER IN_DELIVERY IS ACTIVE
    const clientName = req.params.clientNamen // GET THE CLIENT NAME FROM THE REQUEST PARAMS
    try {
        const sales = await saleService.findSalesByClientName(inDelivery, clientName) // FIND ALL SALES BY CLIENT NAME WITH SALE SERVICE
        res.status(200).json({ok: true, data: sales})  // RETURN STATUS 200 AND THE SALES
    } catch(error){
        next(error)
    }
}

export const getSalesBySaleDate = async (req: any, res: Response, next: NextFunction) => {
    const inDelivery = req.filterDelivery // CHECK IF THE FILTER IN_DELIVERY IS ACTIVE
    const saleDate = req.params.saleDate // GET THE SALE DATE FROM THE REQUEST PARAMS
    try{
        const sales = await saleService.findSalesBySaleDate(inDelivery, saleDate) // FIND ALL SALES BY SALE DATE WITH SALE SERVICE
        res.status(200).json({ok: true, data: sales})  // RETURN STATUS 200 AND THE SALES
    } catch(error){
        next(error)
    }
}

export const registerSale = async (req: Request, res: Response, next: NextFunction) => {
    const sale = req.body // GET THE SALE TO CREATE FROM DE REQUEST
    try{
        const newSale = await saleService.createSale(sale) // CREATE THE NEW SALE
        res.status(201).json({ok: true, data: newSale}) //RETURNS STATUS 201 AND THE SALE CREATED
    } catch(error){
        next(error)
    }
}

export const updateSale = async (req: Request, res: Response, next: NextFunction) => {
    const sale = req.body // GET THE SALE TO UPDATE FROM THE REQUEST
    try{
        const saleUpdated = await saleService.getSaleUpdated(sale) // UPDATE THE SALE WITH SALESERVIECE
        res.status(200).json({ok: true, data: saleUpdated}) // RETURNS STATUS 200 AND THE SALE UPDATED
    } catch(error){
        next(error)
    }
}

export const deleteSale = async (req: Request, res: Response, next: NextFunction) => {
    const saleId = req.params.saleId // GET THE SALE ID FROM THE REQUEST PARAMS
    try{
        await saleService.removeSale(saleId) // DELETE THE SALE BY HIS ID WITH SALE SERVICE
        res.status(204).json({ok: true}) // RETURNS STATUS 204 AND OK = TRUE
    }catch(error){
        next(error)
    }
}