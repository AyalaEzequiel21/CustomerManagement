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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateIdSale = exports.existsSaleById = exports.convertDetails = exports.deletePaymentFromSale = exports.updateClientAfterUpdate = exports.updateClientAfterDelete = exports.filterSalesForDelivery = exports.processPaymentSale = exports.addSaleToClient = exports.getTotalSale = exports.findClientByName = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const clientUtils_1 = require("./clientUtils"); //  CLIENT UTILS
const paymentUtils_1 = require("./paymentUtils"); //  PAYMENTS UTILS
const sale_1 = __importDefault(require("../../models/sale"));
const findClientByName = (clientName, session = null) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield (0, clientUtils_1.getClientByName)(clientName, session); // WITH CLIENT UTILS
        return client;
    }
    catch (error) {
        throw error;
    }
});
exports.findClientByName = findClientByName;
const getTotalSale = (details) => {
    let result = 0;
    for (const detail of details) {
        result += detail.partialResult;
    }
    return result;
};
exports.getTotalSale = getTotalSale;
const addSaleToClient = (client, saleId, totalSale, session = null) => __awaiter(void 0, void 0, void 0, function* () {
    (0, clientUtils_1.addNewSale)(client, saleId); // with clientUtils
    client.balance += totalSale;
    yield client.save({ session });
});
exports.addSaleToClient = addSaleToClient;
const processPaymentSale = (payment, saleId, session = null) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentCreated = yield (0, paymentUtils_1.processPayment)(payment, undefined, saleId, session); // WITH PAYMENTS UTILS
        return paymentCreated;
    }
    catch (error) {
        throw error;
    }
});
exports.processPaymentSale = processPaymentSale;
const filterSalesForDelivery = (sales) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliverySales = yield Promise.all(sales.map((sale) => __awaiter(void 0, void 0, void 0, function* () {
            const client = yield (0, exports.findClientByName)(sale.clientName); // SEARCH THE CLIENT WITH SALE UTILS
            if (client && client.in_delivery) {
                return sale;
            }
            return null;
        })));
        return deliverySales.filter((sale) => sale !== null); // RETURN ALL SALES OF CLIENT ACTIVES
    }
    catch (error) {
        throw error;
    }
});
exports.filterSalesForDelivery = filterSalesForDelivery;
const updateClientAfterDelete = (clientName, saleId, totalSale, session = null) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield (0, exports.findClientByName)(clientName, session); // FIND CLIENT WITH HIS NAME
        (0, clientUtils_1.removeSalefromClient)(client, saleId);
        yield (0, clientUtils_1.updateClientBalance)(client, totalSale, false, session); // UPDATE BALANCE OF CLIENT FOUND
    }
    catch (error) {
        throw error;
    }
});
exports.updateClientAfterDelete = updateClientAfterDelete;
const updateClientAfterUpdate = (clientName, oldTotalSale, newTotalSale, session = null) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield (0, exports.findClientByName)(clientName, session); // FIND CLIENT WITH HIS NAME
        // await updateClientBalance(client, oldTotalSale, false, session) // UPDATE BALANCE OF CLIENT FOUND
        yield (0, clientUtils_1.updateClientBalance)(client, newTotalSale - oldTotalSale, true, session); // UPDATE BALANCE OF CLIENT FOUND
    }
    catch (error) {
        throw error;
    }
});
exports.updateClientAfterUpdate = updateClientAfterUpdate;
const deletePaymentFromSale = (paymentId, session = null) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, paymentUtils_1.destroyPayment)(paymentId, session);
});
exports.deletePaymentFromSale = deletePaymentFromSale;
const convertDetails = (oldDetails) => {
    return oldDetails.map(item => ({
        product: new mongoose_1.Types.ObjectId(item.product),
        quantity: item.quantity,
        partialResult: item.partialResult
    }));
};
exports.convertDetails = convertDetails;
const existsSaleById = (saleId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield sale_1.default.exists({ _id: saleId });
});
exports.existsSaleById = existsSaleById;
const validateIdSale = (Id) => {
    let response = false;
    if (mongoose_1.default.Types.ObjectId.isValid(Id)) {
        response = true;
    }
    return response;
};
exports.validateIdSale = validateIdSale;
