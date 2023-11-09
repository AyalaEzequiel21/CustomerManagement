import { BadRequestError } from "../errors/customErrors";
import { BadRequest } from "../errors/errorMessages";
import { errorsPitcher } from "../errors/errorsPitcher";
import { OrderListMongo, OrderListRegister } from "../schemas/orderListSchema";
import { isEmptyList } from "../utils/existingChecker";

/////////////////////////
// ORDER LIST SERVICE
///////////////////////

export const createOrderList = async (newOrder: OrderListRegister) => {
    const {sales} = newOrder // GET THE SALES FROM THE NEW ORDER
    if(isEmptyList(sales)){ // CHECK IF SALES IS EMPTY THEN RUN AN EXCEPTION
        throw new BadRequestError(BadRequest)
    }
    try{
         
    } catch(error){ 
        errorsPitcher(error)
    }
}

export const getOrderUpdated = async (order: OrderListMongo) => {

}

export const searchAllOrders = async () => {

}

export const searchAllCompleted = async () => {
    
}

export const searchAllPending = async () => {
    
}

export const searchByDate = async (orderDate: string) => {
    
}

export const destroyOrder = async (orderId: string) => {
    
}