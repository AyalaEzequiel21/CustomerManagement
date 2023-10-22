import { errorsPitcher } from "../errors/errorsPitcher"
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
    const {clientName, details, totalSale, payment} = sale  
    try{
        const client = await saleUtils.getClientByName(clientName)
    }catch(error){
        errorsPitcher(error)
    }
}

export const getSaleUpdated = async (sale: SaleMongo) => {

}

export const removeSale = async (saleId: string) => {

}