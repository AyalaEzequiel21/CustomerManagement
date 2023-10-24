import { errorsPitcher } from "../../errors/errorsPitcher"
import { ClientDocument } from "../../models/client"
import { TypePaymentDto } from "../../schemas/dtos/paymentDTOSchema"
import { DetailSale } from "../../schemas/saleSchema"
import * as clientUtils from "./clientUtils"
import * as paymentUtils from "./paymentUtils"

export const getClientByName = async (clientName: string) => {
    try {
        const client = await clientUtils.getClientByName(clientName) 
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

export const updateClientBalance = async (client: ClientDocument, totalSale: number) => {
    client.balance += totalSale
    await client.save()    
}

export const processPaymentSale = async (payment: TypePaymentDto, saleId: string) => {
    try{
        const paymentCreated = await paymentUtils.processPayment(payment, undefined, saleId)
        return paymentCreated
    }catch(error){
        errorsPitcher(error)
    }
}