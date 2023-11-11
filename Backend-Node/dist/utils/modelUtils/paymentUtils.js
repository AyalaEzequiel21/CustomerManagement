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
exports.isValidPaymentMethod = exports.validateId = exports.destroyPayment = exports.processPayment = exports.subtractPaymentToClient = exports.addPaymentToClient = exports.findClientById = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const customErrors_1 = require("../../errors/customErrors");
const errorMessages_1 = require("../../errors/errorMessages");
const payment_1 = __importDefault(require("../../models/payment"));
const EPaymentMethod_1 = require("../../enums/EPaymentMethod");
const clientUtils_1 = require("./clientUtils"); // CLIENT UTILS
// function to get a client by id
const findClientById = (clientId, session = null) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield (0, clientUtils_1.getClientById)(clientId, session); // FIND CLIENT BY ID WITH CLIENT UTILS
        return client; // RETURN THE CLIENT
    }
    catch (error) {
        throw error;
    }
});
exports.findClientById = findClientById;
const addPaymentToClient = (client, payment, session = null) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateClient = yield (0, clientUtils_1.updateClientBalance)(client, payment.amount, false, session); // UPDATE THE CLIENT BALANCE WITH CLIENT UTILS
        (0, clientUtils_1.addNewPayment)(updateClient, payment._id); // ADD THE PAYMENT TO CLIENT PAYMENTS WITH CLIENT UTILS
        yield updateClient.save({ session }); // SAVE THE CLIENT UPDATED
    }
    catch (error) {
        throw error;
    }
});
exports.addPaymentToClient = addPaymentToClient;
const subtractPaymentToClient = (client, paymentId, session = null) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payment = yield payment_1.default.findById(paymentId, null, { session }).exec(); // SEARCH THE PAYMENT BY HIS ID
        if (!payment) { // IF NOT EXISTS RUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.PaymentNotFound);
        }
        (0, clientUtils_1.removePaymentfromClient)(client, paymentId); // ELSE REMOVE THE PAYMENT FROM THE CLIENT WITH CLIENT UTILS
        const clientUpdated = yield (0, clientUtils_1.updateClientBalance)(client, payment.amount, true, session); // UPDATE THE CLIENT BALANCE WITH CLIENT UTILS        
    }
    catch (error) {
        throw error;
    }
});
exports.subtractPaymentToClient = subtractPaymentToClient;
const processPayment = (payment, reportId, saleId, session = null) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const IDclient = new mongoose_1.default.Types.ObjectId(payment.clientId); // CONVERT CLIENTID (STRING) TO OBJECTID
        const newPaymentData = {
            clientId: IDclient,
            amount: payment.amount,
            payment_method: payment.payment_method,
            reportId: reportId,
            saleId: saleId
        };
        const newPayment = yield payment_1.default.create([newPaymentData], { session }); // CREATE THE PAYMENT WITH PAYMENT DATA AND SESSION IF EXISTS)
        const client = yield (0, exports.findClientById)(IDclient, session); // GET THE CLIENT BY HIS ID
        if (!client || newPayment.length !== 1) {
            throw new customErrors_1.InternalServerError(errorMessages_1.Conflict);
        }
        yield (0, exports.addPaymentToClient)(client, newPayment[0], session); // IF CLIENT AND NEWPAYMENT EXISTS THEN ADD PAYMENT TO HIS REGISTER AND UPDATE THE CLIENT BALANCE
        return newPayment[0];
    }
    catch (error) {
        throw error;
    }
});
exports.processPayment = processPayment;
const destroyPayment = (paymentId, session = null) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payment = yield payment_1.default.findOne({ _id: paymentId }).session(session); // SEARCH THE PAYMENT 
        if (!payment) {
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.PaymentNotFound);
        }
        const client = yield (0, exports.findClientById)(payment.clientId);
        if (!client) {
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.ClientNotFound);
        }
        (0, clientUtils_1.removePaymentfromClient)(client, paymentId); // ELSE REMOVE THE PAYMENT FROM THE CLIENT WITH CLIENT UTILS
        const clientUpdated = yield (0, clientUtils_1.updateClientBalance)(client, payment.amount, true, session); // UPDATE THE CLIENT BALANCE WITH CLIENT UTILS        
        yield payment_1.default.findByIdAndDelete(paymentId).session(session); // DELETE A PAYMENT IN A SESSION
    }
    catch (error) {
        throw error;
    }
});
exports.destroyPayment = destroyPayment;
const validateId = (Id) => {
    let response = false;
    if (mongoose_1.default.Types.ObjectId.isValid(Id)) {
        response = true;
    }
    return response;
};
exports.validateId = validateId;
const isValidPaymentMethod = (paymentMethod) => {
    return Object.values(EPaymentMethod_1.EPaymentMethod).includes(paymentMethod);
};
exports.isValidPaymentMethod = isValidPaymentMethod;
