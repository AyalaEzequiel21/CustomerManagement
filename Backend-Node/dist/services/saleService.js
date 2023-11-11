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
exports.removeSale = exports.getSaleUpdated = exports.createSale = exports.findSalesBySaleDate = exports.findSalesByClientName = exports.getSales = void 0;
const errorsPitcher_1 = require("../errors/errorsPitcher");
const sale_1 = __importDefault(require("../models/sale"));
const customErrors_1 = require("../errors/customErrors");
const errorMessages_1 = require("../errors/errorMessages");
const existingChecker_1 = require("../utils/existingChecker");
const saleUtils_1 = require("../utils/modelUtils/saleUtils"); //  SALE UTILS
const connect_1 = require("../db/connect");
const dateUtils_1 = require("../utils/dateUtils");
/////////////////////////
// SALE SERVICE
///////////////////////
const getSales = (inDelivery) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sales = yield sale_1.default.find(); // FIND ALL SALES 
        if ((0, existingChecker_1.isEmptyList)(sales)) {
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.SaleNotFound);
        }
        if (inDelivery) {
            const deliverySales = yield (0, saleUtils_1.filterSalesForDelivery)(sales); // IF INDELIVERY IS TRUE THEN FILTER SALES
            return deliverySales;
        }
        return sales;
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.getSales = getSales;
const findSalesByClientName = (inDelivery, clientName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sales = yield sale_1.default.find({ clientName: { $regex: clientName, $options: 'i' } });
        if ((0, existingChecker_1.isEmptyList)(sales)) {
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.SaleNotFound);
        }
        if (inDelivery) {
            const deliverySales = yield (0, saleUtils_1.filterSalesForDelivery)(sales);
            if ((0, existingChecker_1.isEmptyList)(deliverySales)) {
                throw new customErrors_1.ResourceNotFoundError(errorMessages_1.SaleNotFound);
            }
            return deliverySales;
        }
        return sales;
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.findSalesByClientName = findSalesByClientName;
const findSalesBySaleDate = (inDelivery, saleDate) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, dateUtils_1.isValidDateFormat)(saleDate)) { // CHECK IF THE SALE DATE IS VALID OR RUN AN EXCEPTION
        throw new customErrors_1.BadRequestError(errorMessages_1.BadRequest);
    }
    try {
        const sales = yield sale_1.default.find({ sale_date: saleDate }); // SEARCH ALL SALES FROM THAT DATE
        if ((0, existingChecker_1.isEmptyList)(sales)) { // CHECK IF SALES IS EMPTY AND TUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.SaleNotFound);
        }
        if (inDelivery) {
            const deliverySales = yield (0, saleUtils_1.filterSalesForDelivery)(sales);
            return deliverySales;
        }
        return sales;
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.findSalesBySaleDate = findSalesBySaleDate;
const createSale = (sale) => __awaiter(void 0, void 0, void 0, function* () {
    const { clientName, details, payment_dto } = sale; // GET THE DATA TO CREATE SALE
    const session = yield (0, connect_1.startSession)(); // INIT A SESSION
    try {
        session.startTransaction(); // INIT A TRANSACTION 
        const client = yield (0, saleUtils_1.findClientByName)(clientName, session); //FIND THE CLIENT BY HIS ID WITH SALE UTILS
        const newTotalSale = (0, saleUtils_1.getTotalSale)(details); //GET THE TOTAL SALE WITH SALE UTILS
        if (!client) { // IF CLIENT NOT EXISTS RUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.ClientNotFound);
        }
        const saleCreated = yield sale_1.default.create([{
                clientId: client._id,
                clientName: client.fullname,
                details: details,
                totalSale: newTotalSale
            }], { session });
        if (saleCreated.length !== 1) {
            throw new customErrors_1.BadRequestError(errorMessages_1.BadRequest);
        }
        yield (0, saleUtils_1.addSaleToClient)(client, saleCreated[0]._id, newTotalSale, session); // AD SALE CREATED TO CLIENT
        if (payment_dto && payment_dto.clientId === client._id.toString()) { // CHECK IF EXISTS A PAYMENT, THEN CREATE THE PAYMENT 
            const saleId = saleCreated[0]._id;
            const paymentCreated = yield (0, saleUtils_1.processPaymentSale)(payment_dto, saleId, session); // WITH SALE UTILS
            if (!paymentCreated) { // IF THE PAYMENT WAS CREATED CORRECTLY, ADD THE ID TO THE SALE
                throw new customErrors_1.BadRequestError(errorMessages_1.BadRequest);
            }
            saleCreated[0].payment = paymentCreated._id;
            yield saleCreated[0].save({ session });
        }
        yield session.commitTransaction(); // COMMIT TRANSACTION
        return saleCreated; // RETURNS THE SALE CREATED
    }
    catch (error) {
        yield session.abortTransaction();
        throw new customErrors_1.InternalServerError(errorMessages_1.InternalServer);
    }
    finally {
        yield session.endSession(); // FINALLY END THE SESSION
    }
});
exports.createSale = createSale;
const getSaleUpdated = (sale) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, details, clientName } = sale; // GET THE PROPERTIES TO UPDATE SALE
    const session = yield (0, connect_1.startSession)(); // INIT A SESSION
    try {
        session.startTransaction(); // INIT A TRANSACTION
        const saleSaved = yield sale_1.default.findById(_id).exec(); // SEARCH THE SALE BY HIS ID
        if (!saleSaved) { // IF THE SALE NOT EXISTS RUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.SaleNotFound);
        }
        const lastTotal = saleSaved.totalSale;
        saleSaved.details = (0, saleUtils_1.convertDetails)(details);
        saleSaved.totalSale = (0, saleUtils_1.getTotalSale)(details);
        yield (0, saleUtils_1.updateClientAfterUpdate)(saleSaved.clientName, lastTotal, saleSaved.totalSale, session);
        yield saleSaved.save({ session });
        yield session.commitTransaction();
    }
    catch (error) {
        yield session.abortTransaction();
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
    yield session.endSession();
});
exports.getSaleUpdated = getSaleUpdated;
const removeSale = (saleId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, connect_1.startSession)(); // INIT A SESSION
    try {
        session.startTransaction(); // INIT A TRANSACTION 
        const sale = yield sale_1.default.findById(saleId).exec(); // SEARCH THE SALE WITH HER ID 
        if (!sale) { // IF THE SALE NOT EXISTS RUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.SaleNotFound);
        }
        if (sale.payment) { // IF THE SALE HAVE A PAYMENT, THEN DELETE PAYMENT 
            yield (0, saleUtils_1.deletePaymentFromSale)(sale.payment._id, session);
        }
        yield (0, saleUtils_1.updateClientAfterDelete)(sale.clientName, sale._id, sale.totalSale, session);
        yield sale_1.default.findByIdAndDelete(saleId).session(session);
        yield session.commitTransaction(); // CONFIRM TRANSACTION
    }
    catch (error) {
        yield session.abortTransaction(); // IF AN ERROR OCCURS, ABORT TRANSACTION
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
    yield session.endSession(); // END SESSION
});
exports.removeSale = removeSale;
