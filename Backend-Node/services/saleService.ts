import { errorsPitcher } from "../errors/errorsPitcher"
import SaleModel from "../models/sale"
import { SaleMongo, SaleRegister } from "../schemas/saleSchema"
import { BadRequestError, InternalServerError, ResourceNotFoundError } from "../errors/customErrors"
import { BadRequest, ClientNotFound, InternalServer, SaleNotFound } from "../errors/errorMessages"
import { isEmptyList } from "../utils/existingChecker"
import { findClientByName, getTotalSale, processPaymentSale, filterSalesForDelivery, updateBalanceAfterDelete, addSaleToClient, deletePaymentFromSale } from "../utils/modelUtils/saleUtils" //  SALE UTILS
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
        session.startTransaction() // INIT A TRANSACTION 
        const client = await findClientByName(clientName, session) //FIND THE CLIENT BY HIS ID WITH SALE UTILS
        const newTotalSale = getTotalSale(details) //GET THE TOTAL SALE WITH SALE UTILS
        if(!client){   // IF CLIENT NOT EXISTS RUN AN EXCEPTION
            throw new ResourceNotFoundError(ClientNotFound)
        }
        const saleCreated = await SaleModel.create([{ // CREATE THE SALE
            clientId: client._id,
            clientName: client.fullname,
            details: details,
            totalSale: newTotalSale
        }], {session})

        if(saleCreated.length !== 1){
            throw new BadRequestError(BadRequest)
        }
        await addSaleToClient(client, saleCreated[0]._id, newTotalSale, session) // AD SALE CREATED TO CLIENT
        if(payment_dto && payment_dto.clientId === client._id.toString()){ // CHECK IF EXISTS A PAYMENT, THEN CREATE THE PAYMENT 
            const saleId = saleCreated[0]._id
            const paymentCreated = await processPaymentSale(payment_dto, saleId, session) // WITH SALE UTILS
            if(!paymentCreated){ // IF THE PAYMENT WAS CREATED CORRECTLY, ADD THE ID TO THE SALE
                throw new BadRequestError(BadRequest)
            }
            saleCreated[0].payment = paymentCreated._id
            await saleCreated[0].save({session})
        }
        await session.commitTransaction() // COMMIT TRANSACTION
        return saleCreated // RETURNS THE SALE CREATED

    } catch(error){        
        await session.abortTransaction()
        throw new InternalServerError(InternalServer)
    }
    finally{
        session.endSession() // FINALLY END THE SESSION
    }
}

export const getSaleUpdated = async (sale: SaleMongo) => {

}

export const removeSale = async (saleId: string) => {
    const session = await startSession() // INIT A SESSION
    try{
        session.startTransaction() // INIT A TRANSACTION 
        const sale = await SaleModel.findById(saleId).exec() // SEARCH THE SALE WITH HER ID 
        if(!sale){ // IF THE SALE NOT EXISTS RUN AN EXCEPTION
            throw new ResourceNotFoundError(SaleNotFound)
        }
        await updateBalanceAfterDelete(sale.clientName, sale.totalSale, session)
        if(sale.payment){ // IF THE SALE HAVE A PAYMENT, THEN DELETE PAYMENT 
            await deletePaymentFromSale(sale.payment._id, session)
        }
        await SaleModel.findByIdAndDelete(saleId).session(session)
        await session.commitTransaction() // CONFIRM TRANSACTION
    }catch(error){
        await session.abortTransaction() // IF AN ERROR OCCURS, ABORT TRANSACTION
        errorsPitcher(error)
    }
    session.endSession() // END SESSION
}