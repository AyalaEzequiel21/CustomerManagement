import { Types } from "mongoose";
import { BadRequestError } from "../../errors/customErrors";
import { BadRequest } from "../../errors/errorMessages";
import { DetailOrder } from "../../schemas/orderListSchema"
import {existsSaleById, validateIdSale} from "./saleUtils"


export const validateSales = async (sales: DetailOrder[]) => {
    try {
        const isAnyNull = await Promise.all(
            sales.map(async (sale) => {
                if(!validateIdSale(sale.saleId)){
                     throw new BadRequestError(BadRequest)
                    }
                return await existsSaleById(sale.saleId)
            })
        );

        return isAnyNull.some((isNull) => isNull);

    } catch(error){
        throw error
    }
}

interface detailSale {
    saleId: Types.ObjectId,
    clientName: string,
    totalSale: number
}

export const convertDetailsSale = (sales: DetailOrder[]): Types.DocumentArray<detailSale> => {
    return new Types.DocumentArray(sales.map(item => ({
        saleId: new Types.ObjectId(item.saleId),
        clientName: item.clientName,
        totalSale: item.totalSale
        }))
    )
}