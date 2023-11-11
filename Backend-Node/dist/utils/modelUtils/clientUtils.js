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
exports.removeSalefromClient = exports.addNewSale = exports.removePaymentfromClient = exports.addNewPayment = exports.updateClientBalance = exports.getClientByName = exports.getClientById = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const customErrors_1 = require("../../errors/customErrors");
const errorMessages_1 = require("../../errors/errorMessages");
const client_1 = __importDefault(require("../../models/client"));
// function to get a client by id
const getClientById = (clientId, session = null) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield client_1.default.findOne({ _id: clientId }).session(session); // FIND CLIENT BY ID
        if (client && client.is_active) { // IF THE CLIENT EXISTS AND IS ACTIVE
            return client; // RETURN THE CLIENT
        }
        throw new customErrors_1.ResourceNotFoundError(errorMessages_1.ClientNotFound);
    }
    catch (error) {
        throw error;
    }
});
exports.getClientById = getClientById;
const getClientByName = (clientName, session = null) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield client_1.default.findOne({ fullname: clientName }).session(session); // FIND CLIENT BY HIS NAME
        if (client && client.is_active) { // IF THE CLIENT EXISTS AND IS ACTIVE
            return client; // RETURN THE CLIENT
        }
        throw new customErrors_1.ResourceNotFoundError(errorMessages_1.ClientNotFound);
    }
    catch (error) {
        throw error;
    }
});
exports.getClientByName = getClientByName;
// function to update de client balance
const updateClientBalance = (client, amount, isAdd, session = null) => __awaiter(void 0, void 0, void 0, function* () {
    isAdd ? client.balance += amount : client.balance -= amount; // IF ADD IS TRUE THEN ADD THE AMOUNT TO BALANCE, ELSE SUBTRACT AMOUNT TO BALANCE
    try {
        return client.save({ session }); // RETURN THE CLIENT UPDATED
    }
    catch (error) {
        throw new customErrors_1.InternalServerError(`${errorMessages_1.InternalServer} - ${error}`);
    }
});
exports.updateClientBalance = updateClientBalance;
const addNewPayment = (client, paymentId) => {
    client.payments.push((typeof paymentId == "string") ?
        new mongoose_1.default.Types.ObjectId(paymentId)
        :
            paymentId);
};
exports.addNewPayment = addNewPayment;
const removePaymentfromClient = (client, paymentId) => {
    client.payments = client.payments.filter(payment => payment._id.toString() !== paymentId.toString());
};
exports.removePaymentfromClient = removePaymentfromClient;
const addNewSale = (client, saleId) => {
    client.sales.push((typeof saleId == "string") ?
        new mongoose_1.default.Types.ObjectId(saleId)
        :
            saleId);
};
exports.addNewSale = addNewSale;
const removeSalefromClient = (client, saleId) => {
    client.sales = client.sales.filter(sale => sale._id.toString() !== saleId.toString());
};
exports.removeSalefromClient = removeSalefromClient;
