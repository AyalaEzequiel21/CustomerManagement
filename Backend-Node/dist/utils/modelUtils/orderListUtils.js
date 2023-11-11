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
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertDetailsSale = exports.validateSales = void 0;
const mongoose_1 = require("mongoose");
const customErrors_1 = require("../../errors/customErrors");
const errorMessages_1 = require("../../errors/errorMessages");
const saleUtils_1 = require("./saleUtils");
const validateSales = (sales) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isAnyNull = yield Promise.all(sales.map((sale) => __awaiter(void 0, void 0, void 0, function* () {
            if (!(0, saleUtils_1.validateIdSale)(sale.saleId)) {
                throw new customErrors_1.BadRequestError(errorMessages_1.BadRequest);
            }
            return yield (0, saleUtils_1.existsSaleById)(sale.saleId);
        })));
        return isAnyNull.some((isNull) => isNull);
    }
    catch (error) {
        throw error;
    }
});
exports.validateSales = validateSales;
const convertDetailsSale = (sales) => {
    return new mongoose_1.Types.DocumentArray(sales.map(item => ({
        saleId: new mongoose_1.Types.ObjectId(item.saleId),
        clientName: item.clientName,
        totalSale: item.totalSale
    })));
};
exports.convertDetailsSale = convertDetailsSale;
