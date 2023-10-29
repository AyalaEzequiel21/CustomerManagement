import mongoose from "mongoose"
import { errorsPitcher } from "../../errors/errorsPitcher"
import { ClientDocument } from "../../models/client"
import { TypePaymentDto } from "../../schemas/dtos/paymentDTOSchema"
import { DetailSale } from "../../schemas/saleSchema"
import { getClientByName } from "./clientUtils" //  CLIENT UTILS
import { processPayment } from "./paymentUtils" //  PAYMENTS UTILS

export const findClientByName = async (clientName: string, session: mongoose.ClientSession | null = null) => {
    try {
        const client = await getClientByName(clientName, session) // WITH CLIENT UTILS
        return client
    } catch(error){
        errorsPitcher(error)
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
        errorsPitcher(error)
    }
}