import mongoose from "mongoose"
import { ClientDocument } from "../../models/client"
import { TypePaymentDto } from "../../schemas/dtos/paymentDTOSchema"
import { DetailSale, SaleMongo } from "../../schemas/saleSchema"
import { getClientByName, updateClientBalance } from "./clientUtils" //  CLIENT UTILS
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

export const addTotalSaletoBalance = async (client: ClientDocument, totalSale: number, session: mongoose.ClientSession | null = null) => {
    client.balance += totalSale
    await client.save({session})    
}

export const processPaymentSale = async (payment: TypePaymentDto, saleId: string, session: mongoose.ClientSession | null = null) => {
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

export const updateBalance = async (clientName: string, totalSale: number, session: mongoose.ClientSession | null = null) => {
    try {
        const client = await findClientByName(clientName, session) // FIND CLIENT WITH HIS NAME
        await updateClientBalance(client as ClientDocument, totalSale, false, session) // UPDATE BALANCE OF CLIENT FOUND
    } catch(error){
        throw error
    }
}

export const deletePayment = async (paymentId: string, session: mongoose.ClientSession | null = null) => {
    await destroyPayment(paymentId, session)
}