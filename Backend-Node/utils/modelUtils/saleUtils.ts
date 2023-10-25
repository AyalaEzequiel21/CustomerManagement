import { errorsPitcher } from "../../errors/errorsPitcher"
import { ClientDocument } from "../../models/client"
import { TypePaymentDto } from "../../schemas/dtos/paymentDTOSchema"
import { DetailSale } from "../../schemas/saleSchema"
import { getClientByName } from "./clientUtils" //  CLIENT UTILS
import { processPayment } from "./paymentUtils" //  PAYMENTS UTILS

export const findClientByName = async (clientName: string) => {
    try {
        const client = await getClientByName(clientName) // WITH CLIENT UTILS
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

export const addTotalSaletoBalance = async (client: ClientDocument, totalSale: number) => {
    client.balance += totalSale
    await client.save()    
}

export const processPaymentSale = async (payment: TypePaymentDto, saleId: string) => {
    try{
        const paymentCreated = await processPayment(payment, undefined, saleId) // WITH PAYMENTS UTILS
        return paymentCreated
    }catch(error){
        errorsPitcher(error)
    }
}