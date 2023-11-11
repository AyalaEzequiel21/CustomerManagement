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