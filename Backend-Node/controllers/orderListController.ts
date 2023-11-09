import { NextFunction, Request, Response } from "express";
import * as orderListService from "../services/orderListService"

/////////////////////////
// ORDER LIST CONTROLLER
///////////////////////

export const registerOrderList = async (req: Request, res: Response, next: NextFunction) => {
    const order = req.body // GET THE ORDER FROM THE REQUEST
    try{
        const newOrder = await orderListService.createOrderList(order) // CREATE THE NEW ORDER WITH ORDER LIST SERVICE
        res.status(201).json({ok: true, data: newOrder}) // RETURNS STATUS 201 AND THE ORDER CREATED 
    } catch(error){ 
        next(error)
    }
}

export const updateOrderList = async (req: Request, res: Response, next: NextFunction) => {
    const order = req.body // GET THE ORDER TO UPDATE FROM THE REQUES
    try{
        const orderUpdated = await orderListService.getOrderUpdated(order) // UPDATE THE ORDER WITH ORDER SERVICE
        res.status(200).json({ok: true, data: orderUpdated}) // RETURNS STATUS 200 AND THE ORDER UPDATED
    } catch(error){
        next(error)
    }
}

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const orders = await orderListService.searchAllOrders() // SEARCH ALL ORDERS WITH SERVICE
        res.status(200).json({ok: true, data: orders}) // RETURNS STATUS 200 AND THE ORDERS 
    }catch( error){
        next(error)
    }
}

export const getAllCompletedOrders = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const completedOrders = await orderListService.searchAllCompleted() // SEARCH ALL COMPLETED ORDERS WITH SERVICE
        res.status(200).json({ok: true, data: completedOrders}) // RETURNS STATUS 200 AND THE ORDERS 
    }catch( error){
        next(error)
    }
}

export const getAllPendingOrders = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const pendingOrders = await orderListService.searchAllPending() // SEARCH ALL PENDING ORDERS WITH SERVICE
        res.status(200).json({ok: true, data: pendingOrders}) // RETURNS STATUS 200 AND THE ORDERS 
    }catch( error){
        next(error)
    }
}

export const getOrdersByDate = async (req: any, res: Response, next: NextFunction) => {
    const {date} = req.query //  GET THE ORDER DATE FROM THE PARAMS QUERY
    try{
        const orders = await orderListService.searchByDate(date) // SEARCH ALL ORDERS WITH THE SAME DATE WITH SERVICE
        res.status(200).json({ok: true, data: orders}) // RETURNS STATUS 200 AND THE ORDERS 
    }catch( error){
        next(error)
    }
}

export const deleteOrderById = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.orderId // GET THE ORDER ID TO DELTE FROM THE PARAMAS
    try{
        await orderListService.destroyOrder(orderId) // DELETE THE ORDER WITH SERVICE
        res.status(204).json({ok: true}) //  RETURNS STATUS 204 AND OK: TRUE
    } catch(error){
        next(error)
    }
}