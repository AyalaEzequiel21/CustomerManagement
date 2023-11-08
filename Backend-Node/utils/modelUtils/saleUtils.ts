import mongoose, { Types } from "mongoose"
import { ClientDocument } from "../../models/client"
import { TypePaymentDto } from "../../schemas/dtos/paymentDTOSchema"
import { DetailSale, SaleMongo } from "../../schemas/saleSchema"
import { addNewSale, getClientByName, removeSalefromClient, updateClientBalance } from "./clientUtils" //  CLIENT UTILS
import { destroyPayment, processPayment } from "./paymentUtils" //  PAYMENTS UTILS

export const findClientByName = async (clientName: string, session: mongoose.ClientSession | null = null) => {
    try {
        const client = await getClientByName(clientName, session) // WITH CLIENT UTILS
        return client
    } catch(error){
        throw error
    }
}

export const getTotalSale = (details: DetailSale[]) => {
    let result = 0
    for(const detail of details){
        result += detail.partialResult
    }
    return result
}

export const addSaleToClient = async (client: ClientDocument, saleId: string | mongoose.Types.ObjectId, totalSale: number, session: mongoose.ClientSession | null = null) => {
    addNewSale(client, saleId) // with clientUtils
    client.balance += totalSale
    await client.save({session})
}


export const processPaymentSale = async (payment: TypePaymentDto, saleId: mongoose.Types.ObjectId, session: mongoose.ClientSession | null = null) => {
    try{
        const paymentCreated = await processPayment(payment, undefined, saleId, session) // WITH PAYMENTS UTILS
        return paymentCreated
    }catch(error){
        throw error
    }
}

export const filterSalesForDelivery = async (sales: SaleMongo[]) => {
    try{
        const deliverySales = await Promise.all(sales.map(async (sale) => { // FILTER ALL SALES WITH CLIEN INDELIVERY IS TRUE
            const client = await findClientByName(sale.clientName); // SEARCH THE CLIENT WITH SALE UTILS
            if (client && client.in_delivery) {
                return sale 
            }
            return null 
        }));
        return deliverySales.filter((sale) => sale !== null) // RETURN ALL SALES OF CLIENT ACTIVES
    } catch(error){
        throw error
    }
}

export const updateClientAfterDelete = async (clientName: string, saleId: mongoose.Types.ObjectId, totalSale: number, session: mongoose.ClientSession | null = null) => {
    try {
        const client = await findClientByName(clientName, session) // FIND CLIENT WITH HIS NAME
        removeSalefromClient(client, saleId)
        await updateClientBalance(client, totalSale, false, session) // UPDATE BALANCE OF CLIENT FOUND
    } catch(error){
        throw error
    }
}

export const updateClientAfterUpdate = async (clientName: string, oldTotalSale: number, newTotalSale: number, session: mongoose.ClientSession | null = null) => {
    try {
        const client = await findClientByName(clientName, session) // FIND CLIENT WITH HIS NAME
        await updateClientBalance(client, oldTotalSale, false, session) // UPDATE BALANCE OF CLIENT FOUND
        await updateClientBalance(client, newTotalSale, true, session) // UPDATE BALANCE OF CLIENT FOUND
    } catch(error){
        throw error
    }
}

export const deletePaymentFromSale = async (paymentId: mongoose.Types.ObjectId, session: mongoose.ClientSession | null = null) => {
    await destroyPayment(paymentId, session)
}


export const convertDetails = (oldDetails: DetailSale[]) => {
    return oldDetails.map(item => ({
        product: new Types.ObjectId(item.product),
        quantity: item.quantity,
        partialResult: item.partialResult
    }))
};