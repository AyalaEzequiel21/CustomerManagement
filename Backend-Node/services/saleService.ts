import mongoose from "mongoose"
import { errorsPitcher } from "../errors/errorsPitcher"
import SaleModel from "../models/sale"
import { SaleMongo, SaleRegister } from "../schemas/saleSchema"
import { InternalServerError, ResourceNotFoundError } from "../errors/customErrors"
import { ClientNotFound, InternalServer, SaleNotFound } from "../errors/errorMessages"
import { isEmptyList } from "../utils/existingChecker"
import { findClientByName, getTotalSale, addTotalSaletoBalance, processPaymentSale } from "../utils/modelUtils/saleUtils" //  SALE UTILS
import { startSession } from "../db/connect"


/////////////////////////
// SALE SERVICE
///////////////////////

export const getSales = async (inDelivery: boolean) => {
    try{
        const sales = await SaleModel.find() // FIND ALL SALES 
        if(isEmptyList(sales)){
            throw new ResourceNotFoundError(SaleNotFound)
        }
        if(inDelivery){
            const deliverySales = await Promise.all(sales.map(async (sale) => {
                const client = await findClientByName(sale.clientName); // WITH SALE UTILS
                if (client && client.in_delivery) {
                    return sale; // Devuelve la venta si cumple con la condición
                }
                return null; // Retorna null para ventas que no cumplen con la condición
            }));
            // Filtra los elementos nulos y devuelve el arreglo resultante
            return deliverySales.filter((sale) => sale !== null);
        }
        return sales
    } catch(error){
        errorsPitcher(error)
    }
} 

export const findSalesByClientName = async (inDelivery: boolean, clientName: string) => {

}

export const findSalesBySaleDate = async (inDelivery: boolean, saleDate: string) => {

}

export const createSale = async (sale: SaleRegister) => {
    try{
        const {clientName, details, payment_dto} = sale  

        const session = await startSession()
        session.startTransaction()
        try{
            const client = await findClientByName(clientName, session) // WITH SALE UTILS
            const newTotalSale = getTotalSale(details) // WITH SALE UTILS
            if(client){
                const saleCreated = await SaleModel.create({
                       clientId: client._id,
                        clientName: client.fullname,
                        details: details,
                        totalSale: newTotalSale
                })
                client.sales.push(saleCreated._id)
                 await addTotalSaletoBalance(client, newTotalSale, session) // WITH SALE UTILS
                if(payment_dto){
                    const saleId = saleCreated._id
                    const paymentCreated = await processPaymentSale(payment_dto, saleId.toString(), session) // WITH SALE UTILS
                    if(paymentCreated){
                        saleCreated.payment = new mongoose.Types.ObjectId(paymentCreated._id)
                        await saleCreated.save({session})
                    }
                }
                session.commitTransaction()
                return saleCreated
            }
            throw new ResourceNotFoundError(ClientNotFound)
        } catch(error){
            session.abortTransaction()
            throw new InternalServerError(InternalServer)
        } finally {
            session.endSession()
        }    
    } catch(error){
        errorsPitcher(error)
    }
}

export const getSaleUpdated = async (sale: SaleMongo) => {

}

export const removeSale = async (saleId: string) => {

}