import mongoose from "mongoose"
import { errorsPitcher } from "../errors/errorsPitcher"
import SaleModel from "../models/sale"
import { ClientMongo } from "../schemas/clientSchemas"
import { PaymentMongo } from "../schemas/paymentSchema"
import { SaleMongo, SaleRegister } from "../schemas/saleSchema"
import * as saleUtils from "../utils/modelUtils/saleUtils"

/////////////////////////
// SALE SERVICE
///////////////////////

export const getSales = async (inDelivery: boolean) => {

} 

export const findSalesByClientName = async (inDelivery: boolean, clientName: string) => {

}

export const findSalesBySaleDate = async (inDelivery: boolean, saleDate: string) => {

}

export const createSale = async (sale: SaleRegister) => {
    const {clientName, details, payment_dto} = sale  
    try{
        const client = await saleUtils.getClientByName(clientName) as ClientMongo
        const newTotalSale = saleUtils.getTotalSale(details)
        const saleCreated = await SaleModel.create({
            clientId: client._id,
            clientName: client.fullname,
            details: details,
            totalSale: newTotalSale,
        })
        if(payment_dto){
            const saleId = saleCreated._id
            const paymentCreated = await saleUtils.processPaymentSale(payment_dto, saleId.toString()) as PaymentMongo
            saleCreated.payment = mongoose.Types.ObjectId.createFromHexString(paymentCreated._id)
            await saleCreated.save()
        }
        return saleCreated
    }catch(error){
        console.log(error);
        
        errorsPitcher(error)
    }
}

export const getSaleUpdated = async (sale: SaleMongo) => {

}

export const removeSale = async (saleId: string) => {

}