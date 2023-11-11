"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrderById = exports.getOrdersByDate = exports.getAllPendingOrders = exports.getAllCompletedOrders = exports.getAllOrders = exports.updateOrderList = exports.registerOrderList = void 0;
const orderListService = __importStar(require("../services/orderListService"));
/////////////////////////
// ORDER LIST CONTROLLER
///////////////////////
const registerOrderList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const order = req.body; // GET THE ORDER FROM THE REQUEST
    try {
        const newOrder = yield orderListService.createOrderList(order); // CREATE THE NEW ORDER WITH ORDER LIST SERVICE
        res.status(201).json({ ok: true, data: newOrder }); // RETURNS STATUS 201 AND THE ORDER CREATED 
    }
    catch (error) {
        next(error);
    }
});
exports.registerOrderList = registerOrderList;
const updateOrderList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const order = req.body; // GET THE ORDER TO UPDATE FROM THE REQUES
    try {
        const orderUpdated = yield orderListService.getOrderUpdated(order); // UPDATE THE ORDER WITH ORDER SERVICE
        res.status(200).json({ ok: true, data: orderUpdated }); // RETURNS STATUS 200 AND THE ORDER UPDATED
    }
    catch (error) {
        next(error);
    }
});
exports.updateOrderList = updateOrderList;
const getAllOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield orderListService.searchAllOrders(); // SEARCH ALL ORDERS WITH SERVICE
        res.status(200).json({ ok: true, data: orders }); // RETURNS STATUS 200 AND THE ORDERS 
    }
    catch (error) {
        next(error);
    }
});
exports.getAllOrders = getAllOrders;
const getAllCompletedOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const completedOrders = yield orderListService.searchAllCompleted(); // SEARCH ALL COMPLETED ORDERS WITH SERVICE
        res.status(200).json({ ok: true, data: completedOrders }); // RETURNS STATUS 200 AND THE ORDERS 
    }
    catch (error) {
        next(error);
    }
});
exports.getAllCompletedOrders = getAllCompletedOrders;
const getAllPendingOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pendingOrders = yield orderListService.searchAllPending(); // SEARCH ALL PENDING ORDERS WITH SERVICE
        res.status(200).json({ ok: true, data: pendingOrders }); // RETURNS STATUS 200 AND THE ORDERS 
    }
    catch (error) {
        next(error);
    }
});
exports.getAllPendingOrders = getAllPendingOrders;
const getOrdersByDate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.query; //  GET THE ORDER DATE FROM THE PARAMS QUERY
    try {
        const orders = yield orderListService.searchByDate(date); // SEARCH ALL ORDERS WITH THE SAME DATE WITH SERVICE
        res.status(200).json({ ok: true, data: orders }); // RETURNS STATUS 200 AND THE ORDERS 
    }
    catch (error) {
        next(error);
    }
});
exports.getOrdersByDate = getOrdersByDate;
const deleteOrderById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.orderId; // GET THE ORDER ID TO DELTE FROM THE PARAMAS
    try {
        yield orderListService.destroyOrder(orderId); // DELETE THE ORDER WITH SERVICE
        res.status(204).json({ ok: true }); //  RETURNS STATUS 204 AND OK: TRUE
    }
    catch (error) {
        next(error);
    }
});
exports.deleteOrderById = deleteOrderById;
