import mongoose from "mongoose"
import { errorsPitcher } from "../errors/errorsPitcher"
import SaleModel from "../models/sale"
import { SaleMongo, SaleRegister } from "../schemas/saleSchema"
import { BadRequestError, InternalServerError, ResourceNotFoundError } from "../errors/customErrors"
import { BadRequest, ClientNotFound, InternalServer, SaleNotFound } from "../errors/errorMessages"
import { isEmptyList } from "../utils/existingChecker"
import { findClientByName, getTotalSale, addTotalSaletoBalance, processPaymentSale, filterSalesForDelivery } from "../utils/modelUtils/saleUtils" //  SALE UTILS
import { startSession } from "../db/connect"
import { isValidDateFormat } from "../utils/dateUtils"


/////////////////////////
// SALE SERVICE
///////////////////////

export const getSales = async (inDelivery: boolean) => {
    try{
        const sales = await SaleModel.find() as SaleMongo[]// FIND ALL SALES 
        if(isEmptyList(sales)){
            throw new ResourceNotFoundError(SaleNotFound)
        }
        if(inDelivery){
            const deliverySales = await filterSalesForDelivery(sales) // IF INDELIVERY IS TRUE THEN FILTER SALES
            return deliverySales
        }
        return sales
    } catch(error){
        errorsPitcher(error)
    }
} 

export const findSalesByClientName = async (inDelivery: boolean, clientName: string) => {
    try{
        const sales = await SaleModel.find({ clientName: { $regex: clientName, $options: 'i' } }) as SaleMongo[]
        if(isEmptyList(sales)){
            throw new ResourceNotFoundError(SaleNotFound)
        }
        if(inDelivery){
            const deliverySales = await filterSalesForDelivery(sales)
            if(isEmptyList(deliverySales)){
                throw new ResourceNotFoundError(SaleNotFound)
            }
            return deliverySales
        }
        return sales
    }catch(error){
        errorsPitcher(error)
    }
}

export const findSalesBySaleDate = async (inDelivery: boolean, saleDate: string) => {
    if(!isValidDateFormat(saleDate)){ // CHECK IF THE SALE DATE IS VALID OR RUN AN EXCEPTION
        throw new BadRequestError(BadRequest)
    }
    try{
        const sales = await SaleModel.find({sale_date: saleDate}) as SaleMongo[] // SEARCH ALL SALES FROM THAT DATE
        if(isEmptyList(sales)){ // CHECK IF SALES IS EMPTY AND TUN AN EXCEPTION
            throw new ResourceNotFoundError(SaleNotFound)
        }
        if(inDelivery){
            const deliverySales = await filterSalesForDelivery(sales)
            return deliverySales
        }
        return sales
    } catch (error){
        errorsPitcher(error)
    }
}

export const createSale = async (sale: SaleRegister) => {
    const {clientName, details, payment_dto} = sale  // GET THE DATA TO CREATE SALE
    const session = await startSession() // INIT A SESSION
    try{
        session.startTransaction()
        const client = await findClientByName(clientName, session) // WITH SALE UTILS
        const newTotalSale = getTotalSale(details) // WITH SALE UTILS
        if(!client){   // IF CLIENT NOT EXISTS RUN AN EXCEPTION
            throw new ResourceNotFoundError(ClientNotFound)
        }
        const saleCreated = await SaleModel.create([{ // CREATE THE SALE
            clientId: client._id,
            clientName: client.fullname,
            details: details,
            totalSale: newTotalSale
        }], {session})

        if(saleCreated.length === 1){
            client.sales.push(saleCreated[0]._id) // AD SALE CREATED TO CLIENT
            await addTotalSaletoBalance(client, newTotalSale, session) // WITH SALE UTILS
            if(payment_dto){ // CHECK IF EXISTS A PAYMENT, THEN CREATE THE PAYMENT 
                const saleId = saleCreated[0]._id
                const paymentCreated = await processPaymentSale(payment_dto, saleId.toString(), session) // WITH SALE UTILS
                if(paymentCreated){ // IF THE PAYMENT WAS CREATED CORRECTLY, ADD THE ID TO THE SALE
                    saleCreated[0].payment = new mongoose.Types.ObjectId(paymentCreated._id)
                    await saleCreated[0].save({session})
                }
            }
        }
        session.commitTransaction() // COMMIT TRANSACTION
        return saleCreated // RETURNS THE SALE CREATED
    } catch(error){
        session.abortTransaction()
        throw new InternalServerError(InternalServer)
    }
    finally{
        session.endSession() // FINALLY END THE SESSION
    }
}

export const getSaleUpdated = async (sale: SaleMongo) => {

}

export const removeSale = async (saleId: string) => {

}