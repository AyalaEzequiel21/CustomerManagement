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
exports.getPaymentsByPaymentDate = exports.getPaymentsByPaymentMethod = exports.getPaymentsByClientId = exports.allPayments = exports.deletePaymentById = exports.createPayment = void 0;
const customErrors_1 = require("../errors/customErrors");
const errorMessages_1 = require("../errors/errorMessages");
const errorsPitcher_1 = require("../errors/errorsPitcher");
const payment_1 = __importDefault(require("../models/payment"));
const paymentUtils_1 = require("../utils/modelUtils/paymentUtils"); // PAYMENTS UTILS
const dateUtils_1 = require("../utils/dateUtils");
const existingChecker_1 = require("../utils/existingChecker");
const connect_1 = require("../db/connect");
/////////////////////////
// PAYMENT SERVICE
///////////////////////
const createPayment = (newPayment) => __awaiter(void 0, void 0, void 0, function* () {
    const { clientId, amount, payment_method, saleId, reportId } = newPayment; // GET ALL ATTRIBUTES TO CREATE A PAYMENT
    const session = yield (0, connect_1.startSession)(); // START A SESSION FOR THE TRANSACTION
    try {
        session.startTransaction();
        const client = yield (0, paymentUtils_1.findClientById)(clientId, session); // GET THE CLIENT OF PAYMENT BY HIS ID WITH PAYMENTS UTILS
        if (client) { // IF CLIENT EXISTS THEN CREATED THE PAYMENT
            const paymentData = {
                clientId: clientId,
                amount: amount,
                payment_method: payment_method,
                saleId: saleId || undefined,
                reportId: reportId || undefined
            };
            const paymentCreated = yield payment_1.default.create([paymentData], { session }); // CREATE THE PAYMENT WITH PAYMENT DATA AND SESSION
            if (!paymentCreated[0]) { // We use position 0 because only one payment will be created
                throw new customErrors_1.BadRequestError(errorMessages_1.BadRequest); // IF PAMETN NOT EXISTS RUN AN EXCEPTION
            }
            yield (0, paymentUtils_1.addPaymentToClient)(client, paymentCreated[0], session); // ADD THE PAYMENT TO CLIENT AND UPDATE HIS BALANCE WITH PAYMENT UTILS
            yield session.commitTransaction(); // CONFIRM TRANSACTION
            return paymentCreated; // RETURNS THE PAYMENT CREATED
        }
    }
    catch (error) {
        yield session.abortTransaction();
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
    yield session.endSession(); // END THE SESSION
});
exports.createPayment = createPayment;
const deletePaymentById = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, paymentUtils_1.validateId)(paymentId)) { // CHECK IF PAYMENTID IS VALID WITH PAYMENTUTILS OR RUN AN EXCEPTION
        throw new customErrors_1.BadRequestError(errorMessages_1.BadRequest);
    }
    const session = yield (0, connect_1.startSession)(); // START A SESSION FOR THE TRANSACTION
    try {
        session.startTransaction();
        const existsPayment = yield payment_1.default.findById(paymentId).exec(); // SEARCH THE PAYMENT
        if (!existsPayment) { // CHECK IF EXISTS OR RUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.PaymentNotFound);
        }
        const client = yield (0, paymentUtils_1.findClientById)(existsPayment.clientId); // SEARCH THE CLIENT OF PAYMENT
        if (!client) { // IF NOT EXIST RUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.ClientNotFound);
        }
        yield (0, paymentUtils_1.subtractPaymentToClient)(client, existsPayment._id, session); // REMOVE THE PAYMENT FROM TE CLIENT AND UPDATE HIS BALANCE WITH PAYMENTUTILS
        yield payment_1.default.findByIdAndDelete(existsPayment._id).session(session); // DELETE THE PAYMENT FROM TO DATA BASE
        yield session.commitTransaction(); // CONFIRM TRANSACTION
    }
    catch (error) {
        yield session.abortTransaction();
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
    yield session.endSession();
});
exports.deletePaymentById = deletePaymentById;
const allPayments = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payments = yield payment_1.default.find(); //  GET ALL PAYMENTS
        if ((0, existingChecker_1.isEmptyList)(payments)) { // CHECK IF THE RESPONSE IS EMPTY AND RUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.PaymentNotFound);
        }
        return payments; // RETURN THE PAYMENTS
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.allPayments = allPayments;
const getPaymentsByClientId = (clientId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, paymentUtils_1.validateId)(clientId)) { // CHECK IF ID IS VALID WITH PAYMENTUTILS
        throw new customErrors_1.BadRequestError(errorMessages_1.BadRequest);
    }
    try {
        const payments = yield payment_1.default.find({ clientId: clientId }); //  GET ALL PAYMENTS FROM A CLIENT BY HIS ID
        if ((0, existingChecker_1.isEmptyList)(payments)) { //CHECK IF THE RESPONSE IS EMPTY  AND RUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.PaymentNotFound);
        }
        return payments; // RETURN THE PAYMENTS
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.getPaymentsByClientId = getPaymentsByClientId;
const getPaymentsByPaymentMethod = (paymentMethod) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, paymentUtils_1.isValidPaymentMethod)(paymentMethod)) { // CHECK IF PAYMENTmEHOD IS VALID WITH PAYMENTUTILS OR RUN AN EXCEPTION 
        throw new customErrors_1.BadRequestError(errorMessages_1.BadRequest);
    }
    try {
        const payments = yield payment_1.default.find({ payment_method: paymentMethod }); //  GET ALL PAYMENTS FILTERED BY PAYMENT_METHOD
        if ((0, existingChecker_1.isEmptyList)(payments)) { //CHECK IF THE RESPONSE IS EMPTY  AND RUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.PaymentNotFound);
        }
        return payments; // RETURN THE PAYMENTS
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.getPaymentsByPaymentMethod = getPaymentsByPaymentMethod;
const getPaymentsByPaymentDate = (paymentDate) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, dateUtils_1.isValidDateFormat)(paymentDate)) { // CHECK IF PAYMENTmEHOD IS VALID OR RUN AN EXCEPTION
        throw new customErrors_1.BadRequestError(errorMessages_1.BadRequest);
    }
    try {
        const payments = yield payment_1.default.find({ payment_date: paymentDate }); //  GET ALL PAYMENTS FILTERED BY PAYMENT_DATE
        if ((0, existingChecker_1.isEmptyList)(payments)) { //CHECK IF THE RESPONSE IS EMPTY  AND RUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.PaymentNotFound);
        }
        return payments; // RETURN THE PAYMENTS
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.getPaymentsByPaymentDate = getPaymentsByPaymentDate;
