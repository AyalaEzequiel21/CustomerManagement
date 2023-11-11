import mongoose, { Types } from "mongoose";
import { EOrderSatus } from "../enums/EOrderStatus";
import { BadRequestError, InternalServerError, ResourceNotFoundError } from "../errors/customErrors";
import { BadRequest, Conflict, OrderNotFound } from "../errors/errorMessages";
import { errorsPitcher } from "../errors/errorsPitcher";
import OrderListModel from "../models/orderList";
import { OrderListMongo, OrderListRegister } from "../schemas/orderListSchema";
import { isValidDateFormat } from "../utils/dateUtils";
import { isEmptyList } from "../utils/existingChecker";
import { convertDetailsSale, validateSales } from "../utils/modelUtils/orderListUtils";

/////////////////////////
// ORDER LIST SERVICE
///////////////////////

export const createOrderList = async (newOrder: OrderListRegister) => {
    const {sales} = newOrder // GET THE SALES FROM THE NEW ORDER
    if(isEmptyList(sales)){ // CHECK IF SALES IS EMPTY THEN RUN AN EXCEPTION
        throw new BadRequestError(BadRequest)
    }
    try{
        const verificationSales = await validateSales(sales) // CHECK IF ALL SALES ARE VALID
        if(!verificationSales){ // IF ANY IS INVALID RUN AN EXCEPTION
            throw new BadRequestError(BadRequest)
        }
        const orderCreated = await OrderListModel.create({ // CREATE THE ORDER
            sales: sales
        })
        if(!orderCreated){
            throw new InternalServerError(Conflict)
        }
        return orderCreated // RETURN THE ORDER
    } catch(error){ 
        errorsPitcher(error)
    }
}

export const getOrderUpdated = async (order: OrderListMongo) => {
    const {_id, sales, order_status} = order // GET ATTRIBUTES NECESARY FOR UPDATE 
    try{
        const orderSaved = await OrderListModel.findOne({_id: _id}) // SEARCH A ORDER WITH THE SAME ID
        if(!orderSaved || orderSaved.order_status === EOrderSatus.Completo){ // IF ORDER NOT EXISTS OR HIS STATUS IS COMPLETED THEN RUN AN EXCEPTION
            throw new ResourceNotFoundError(OrderNotFound)
        }
        if(!await validateSales(sales)){ // CHECK IF ALL SALES ARE VALID
            throw new BadRequestError(BadRequest)
        }
        orderSaved.sales = convertDetailsSale(sales) // THEN UPDATE THE ORDER
        orderSaved.order_status = order_status

        await orderSaved.save() // SAVE THE ORDER UPDATED
    } catch(error){
        errorsPitcher(error)
    }
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
    try{
        const orderSaved = await OrderListModel.findOne({_id: orderId})
        if(!orderSaved){
            throw new ResourceNotFoundError(OrderNotFound)
        }
        await OrderListModel.deleteOne({_id: orderId})
    } catch(error){
        errorsPitcher(error)
    }
}