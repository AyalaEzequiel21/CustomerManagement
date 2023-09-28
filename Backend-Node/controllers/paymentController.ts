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

export const removePayment = async (req: Request, res: Response, next: NextFunction) => {
    const paymentId = req.params.paymentId // GET THE PAYMENT ID FROM PARAMS 
    try {
        await paymentService.deletePaymentById(paymentId) // DELETE THE PAYMENT WITH PAYMENTSERVICE
        res.status(204).json({ok: true}) // RETURN STATUS 204 AND OK
    } catch(error){        
        next(error)
    }
}

export const getAllPayments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payments = await paymentService.allPayments() // GET ALL PAYMENTS WITH PAYMENTSERVICE
        res.status(200).json({ok: true, data: payments}) // RETURN STATUS 200 AND THE DATA
    } catch (error){
        next(error)
    }
}

export const getPaymentsOfClient = async (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.body.clientId
    try {
        const payments = await paymentService.getPaymentsByClientId(clientId)
        res.status(200).json({ok: true, data: payments})
    } catch (error){
        next(error)
    }
}