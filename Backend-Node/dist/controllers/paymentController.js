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
exports.getPaymentsOfPaymentDate = exports.getPaymentsOfPaymentMethod = exports.getPaymentsOfClient = exports.getAllPayments = exports.removePayment = exports.registerPayment = void 0;
const paymentService = __importStar(require("../services/paymentService"));
/////////////////////////
// PAYMENT CONTROLLER
///////////////////////
const registerPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = req.body; // GET THE PAYMENT TO CREATE FROM THE REQUEST 
    try {
        const newPayment = yield paymentService.createPayment(payment); // CREATE THE PAYMENT WITH PAYMENTSERVICE
        res.status(201).json({ ok: true, data: newPayment }); // RETURNS STATUS 201 AND THE NEW PAYMENT
    }
    catch (error) {
        next(error);
    }
});
exports.registerPayment = registerPayment;
const removePayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentId = req.params.paymentId; // GET THE PAYMENT ID FROM PARAMS 
    try {
        yield paymentService.deletePaymentById(paymentId); // DELETE THE PAYMENT WITH PAYMENTSERVICE
        res.status(204).json({ ok: true }); // RETURN STATUS 204 AND OK
    }
    catch (error) {
        next(error);
    }
});
exports.removePayment = removePayment;
const getAllPayments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payments = yield paymentService.allPayments(); // GET ALL PAYMENTS WITH PAYMENTSERVICE
        res.status(200).json({ ok: true, data: payments }); // RETURN STATUS 200 AND THE DATA
    }
    catch (error) {
        next(error);
    }
});
exports.getAllPayments = getAllPayments;
const getPaymentsOfClient = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const clientId = req.params.clientId; // GET THE CLIENTID FROM THE PARAMS 
    try {
        const payments = yield paymentService.getPaymentsByClientId(clientId); // FIND ALL PAYMENTS BY CLIENT ID WITH PAYMENTSERVICE
        res.status(200).json({ ok: true, data: payments }); // RETURN STATUS 200 AND THE PAYMENTS
    }
    catch (error) {
        next(error);
    }
});
exports.getPaymentsOfClient = getPaymentsOfClient;
const getPaymentsOfPaymentMethod = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentMethod = req.params.paymentMethod; // GET THE PAYMENTMETHOD FROM THE PARAMS 
    try {
        const payments = yield paymentService.getPaymentsByPaymentMethod(paymentMethod); // FIND ALL PAYMENTS BY PAYMENT METHOD WITH PAYMENTSERVICE
        res.status(200).json({ ok: true, data: payments }); // RETURN STATUS 200 AND THE PAYMENTS
    }
    catch (error) {
        next(error);
    }
});
exports.getPaymentsOfPaymentMethod = getPaymentsOfPaymentMethod;
const getPaymentsOfPaymentDate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.query; // GET THE PAYMENT DATE FROM THE REQUEST 
    try {
        const payments = yield paymentService.getPaymentsByPaymentDate(date); // FIND ALL PAYMENTS BY PAYMENT DATE WITH PAYMENTSERVICE
        res.status(200).json({ ok: true, data: payments }); // RETURN STATUS 200 AND THE PAYMENTS
    }
    catch (error) {
        next(error);
    }
});
exports.getPaymentsOfPaymentDate = getPaymentsOfPaymentDate;
