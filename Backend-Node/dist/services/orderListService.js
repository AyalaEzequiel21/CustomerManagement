"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroyOrder = exports.searchByDate = exports.searchAllPending = exports.searchAllCompleted = exports.searchAllOrders = exports.getOrderUpdated = exports.createOrderList = void 0;
const EOrderStatus_1 = require("../enums/EOrderStatus");
const customErrors_1 = require("../errors/customErrors");
const errorMessages_1 = require("../errors/errorMessages");
const errorsPitcher_1 = require("../errors/errorsPitcher");
const orderList_1 = __importDefault(require("../models/orderList"));
const dateUtils_1 = require("../utils/dateUtils");
const existingChecker_1 = require("../utils/existingChecker");
const orderListUtils_1 = require("../utils/modelUtils/orderListUtils");
/////////////////////////
// ORDER LIST SERVICE
///////////////////////
const createOrderList = (newOrder) => __awaiter(void 0, void 0, void 0, function* () {
    const { sales } = newOrder; // GET THE SALES FROM THE NEW ORDER
    if ((0, existingChecker_1.isEmptyList)(sales)) { // CHECK IF SALES IS EMPTY THEN RUN AN EXCEPTION
        throw new customErrors_1.BadRequestError(errorMessages_1.BadRequest);
    }
    try {
        const verificationSales = yield (0, orderListUtils_1.validateSales)(sales); // CHECK IF ALL SALES ARE VALID
        if (!verificationSales) { // IF ANY IS INVALID RUN AN EXCEPTION
            throw new customErrors_1.BadRequestError(errorMessages_1.BadRequest);
        }
        const orderCreated = yield orderList_1.default.create({
            sales: sales
        });
        if (!orderCreated) {
            throw new customErrors_1.InternalServerError(errorMessages_1.Conflict);
        }
        return orderCreated; // RETURN THE ORDER
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.createOrderList = createOrderList;
const getOrderUpdated = (order) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, sales, order_status } = order; // GET ATTRIBUTES NECESARY FOR UPDATE 
    try {
        const orderSaved = yield orderList_1.default.findOne({ _id: _id }); // SEARCH A ORDER WITH THE SAME ID
        if (!orderSaved || orderSaved.order_status === EOrderStatus_1.EOrderSatus.Completo) { // IF ORDER NOT EXISTS OR HIS STATUS IS COMPLETED THEN RUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.OrderNotFound);
        }
        if (!(yield (0, orderListUtils_1.validateSales)(sales))) { // CHECK IF ALL SALES ARE VALID
            throw new customErrors_1.BadRequestError(errorMessages_1.BadRequest);
        }
        orderSaved.sales = (0, orderListUtils_1.convertDetailsSale)(sales); // THEN UPDATE THE ORDER
        orderSaved.order_status = order_status;
        yield orderSaved.save(); // SAVE THE ORDER UPDATED
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.getOrderUpdated = getOrderUpdated;
const searchAllOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield orderList_1.default.find(); // GET ALL ORDERS SAVED
        if ((0, existingChecker_1.isEmptyList)(orders)) { // CHECK IF ORDERS IS EMPTY THEN RUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.OrderNotFound);
        }
        return orders; // RETURN ORDERS
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.searchAllOrders = searchAllOrders;
const searchAllCompleted = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ordersCompleted = yield orderList_1.default.find({ order_status: EOrderStatus_1.EOrderSatus.Completo }); // GET ALL COMPLETED ORDERS SAVED
        if ((0, existingChecker_1.isEmptyList)(ordersCompleted)) { // CHECK IF ORDERS IS EMPTY THEN RUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.OrderNotFound);
        }
        return ordersCompleted; // RETURN ORDERS
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.searchAllCompleted = searchAllCompleted;
const searchAllPending = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ordersPending = yield orderList_1.default.find({ order_status: EOrderStatus_1.EOrderSatus.Pendiente }); // GET ALL COMPLETED ORDERS SAVED
        if ((0, existingChecker_1.isEmptyList)(ordersPending)) { // CHECK IF ORDERS IS EMPTY THEN RUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.OrderNotFound);
        }
        return ordersPending; // RETURN ORDERS
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.searchAllPending = searchAllPending;
const searchByDate = (orderDate) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, dateUtils_1.isValidDateFormat)(orderDate)) {
        throw new customErrors_1.BadRequestError(errorMessages_1.BadRequest);
    }
    try {
        const orders = yield orderList_1.default.find({ order_date: orderDate }); // GET ALL  ORDERS SAVED
        if ((0, existingChecker_1.isEmptyList)(orders)) { // CHECK IF ORDERS IS EMPTY THEN RUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.OrderNotFound);
        }
        return orders; // RETURN ORDERS
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.searchByDate = searchByDate;
const destroyOrder = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderSaved = yield orderList_1.default.findOne({ _id: orderId });
        if (!orderSaved) {
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.OrderNotFound);
        }
        yield orderList_1.default.deleteOne({ _id: orderId });
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.destroyOrder = destroyOrder;
