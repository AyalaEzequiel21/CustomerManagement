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
exports.processPaymentsReport = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paymentUtils_1 = require("./paymentUtils");
const processPaymentsReport = (payments, reportId, session = null) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentsIds = []; // created an array for add the payments
    try {
        for (const paymentDto of payments) { // all paymentsDto are processed 
            const newPayment = yield (0, paymentUtils_1.processPayment)(paymentDto, reportId, undefined, session); // WITH PAYMENT UTILS
            if (newPayment) {
                paymentsIds.push(new mongoose_1.default.Types.ObjectId(newPayment._id));
            }
        }
        return paymentsIds;
    }
    catch (error) {
        throw error;
    }
});
exports.processPaymentsReport = processPaymentsReport;
