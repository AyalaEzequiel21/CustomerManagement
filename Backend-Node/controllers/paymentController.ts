import { NextFunction, Request, Response } from 'express'
import * as paymentService from '../services/paymentService'

/////////////////////////
// PAYMENT CONTROLLER
///////////////////////

export const registerPayment = async (req: Request, res: Response, next: NextFunction) => {
    const payment = req.body // GET THE PAYMENT TO CREATE FROM THE REQUEST 
    try{
        const newPayment = await paymentService.createPayment(payment)  // CREATE THE PAYMENT WITH PAYMENTSERVICE
        res.status(201).json({ok: true, data: newPayment})  // RETURNS STATUS 200 AND THE NEW PAYMENT
    } catch(error){
        next(error)
    }
}