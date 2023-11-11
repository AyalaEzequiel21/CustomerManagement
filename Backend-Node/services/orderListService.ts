import { EOrderSatus } from "../enums/EOrderStatus";
import { BadRequestError, InternalServerError, ResourceNotFoundError } from "../errors/customErrors";
import { BadRequest, Conflict, OrderNotFound } from "../errors/errorMessages";
import { errorsPitcher } from "../errors/errorsPitcher";
import OrderListModel from "../models/orderList";
import { OrderListMongo, OrderListRegister } from "../schemas/orderListSchema";
import { isValidDateFormat } from "../utils/dateUtils";
import { isEmptyList } from "../utils/existingChecker";
import { validateSales } from "../utils/modelUtils/orderListUtils";

/////////////////////////
// ORDER LIST SERVICE
///////////////////////

export const createOrderList = async (newOrder: OrderListRegister) => {
    const {sales} = newOrder // GET THE SALES FROM THE NEW ORDER
    if(isEmptyList(sales)){ // CHECK IF SALES IS EMPTY THEN RUN AN EXCEPTION
        throw new BadRequestError(BadRequest)
    }
    try{
        const verificationSales = await validateSales(sales)
        if(!verificationSales){
            throw new BadRequestError(BadRequest)
        }

        const orderCreated = await OrderListModel.create({
            sales: sales
        })
        if(!orderCreated){
            throw new InternalServerError(Conflict)
        }
        return orderCreated
    } catch(error){ 
        errorsPitcher(error)
    }
}

export const getOrderUpdated = async (order: OrderListMongo) => {

}

export const searchAllOrders = async () => {
    try{
        const orders = await OrderListModel.find() // GET ALL ORDERS SAVED
        if(isEmptyList(orders)){ // CHECK IF ORDERS IS EMPTY THEN RUN AN EXCEPTION
            throw new ResourceNotFoundError(OrderNotFound)
        }
        return orders // RETURN ORDERS
    } catch(error){
        errorsPitcher(error)
    }
}

export const searchAllCompleted = async () => {
    try{
        const ordersCompleted = await OrderListModel.find({order_status: EOrderSatus.Completo}) // GET ALL COMPLETED ORDERS SAVED
        if(isEmptyList(ordersCompleted)){ // CHECK IF ORDERS IS EMPTY THEN RUN AN EXCEPTION
            throw new ResourceNotFoundError(OrderNotFound)
        }
        return ordersCompleted // RETURN ORDERS
    } catch(error){
        errorsPitcher(error)
    }
}

export const searchAllPending = async () => {
    try{
        const ordersPending = await OrderListModel.find({order_status: EOrderSatus.Pendiente}) // GET ALL COMPLETED ORDERS SAVED
        if(isEmptyList(ordersPending)){ // CHECK IF ORDERS IS EMPTY THEN RUN AN EXCEPTION
            throw new ResourceNotFoundError(OrderNotFound)
        }
        return ordersPending // RETURN ORDERS
    } catch(error){
        errorsPitcher(error)
    }
}

export const searchByDate = async (orderDate: string) => {
    if(!isValidDateFormat(orderDate)){
        throw new BadRequestError(BadRequest)
    }
    try{
        const orders = await OrderListModel.find({order_date: orderDate}) // GET ALL  ORDERS SAVED
        if(isEmptyList(orders)){ // CHECK IF ORDERS IS EMPTY THEN RUN AN EXCEPTION
            throw new ResourceNotFoundError(OrderNotFound)
        }
        return orders // RETURN ORDERS
    } catch(error){
        errorsPitcher(error)
    }
}

export const destroyOrder = async (orderId: string) => {
    
}