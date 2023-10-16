import { NextFunction, Request, Response } from 'express'
import * as paymentService from '../services/paymentService'


/////////////////////////
// PAYMENT CONTROLLER
///////////////////////

export const registerPayment = async (req: Request, res: Response, next: NextFunction) => {
    const payment = req.body // GET THE PAYMENT TO CREATE FROM THE REQUEST 
    try{
        const newPayment = await paymentService.createPayment(payment)  // CREATE THE PAYMENT WITH PAYMENTSERVICE
        res.status(201).json({ok: true, data: newPayment})  // RETURNS STATUS 201 AND THE NEW PAYMENT
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
    const clientId = req.params.clientId // GET THE CLIENTID FROM THE PARAMS 
    try {
        const payments = await paymentService.getPaymentsByClientId(clientId) // FIND ALL PAYMENTS BY CLIENT ID WITH PAYMENTSERVICE
        res.status(200).json({ok: true, data: payments}) // RETURN STATUS 200 AND THE PAYMENTS
    } catch (error){
        next(error)
    }
}

export const getPaymentsOfPaymentMethod = async (req: Request, res: Response, next: NextFunction) => {
    const paymentMethod = req.params.paymentMethod // GET THE PAYMENTMETHOD FROM THE PARAMS 
    try {
        const payments = await paymentService.getPaymentsByPaymentMethod(paymentMethod) // FIND ALL PAYMENTS BY PAYMENT METHOD WITH PAYMENTSERVICE
        res.status(200).json({ok: true, data: payments}) // RETURN STATUS 200 AND THE PAYMENTS
    } catch (error){
        next(error)
    }
}

export const getPaymentsOfPaymentDate = async (req: Request, res: Response, next: NextFunction) => {
    const {date} = req.query // GET THE PAYMENT DATE FROM THE REQUEST 
    try {
        const payments = await paymentService.getPaymentsByPaymentDate(date as string) // FIND ALL PAYMENTS BY PAYMENT DATE WITH PAYMENTSERVICE
        res.status(200).json({ok: true, data: payments}) // RETURN STATUS 200 AND THE PAYMENTS
    } catch (error){
        next(error)
    }
}