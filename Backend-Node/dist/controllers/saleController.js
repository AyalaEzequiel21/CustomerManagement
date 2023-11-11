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
exports.deleteSale = exports.updateSale = exports.registerSale = exports.getSalesBySaleDate = exports.getSalesByClientName = exports.getAllSales = void 0;
const saleService = __importStar(require("../services/saleService"));
/////////////////////////
// SALE CONTROLLER
///////////////////////
const getAllSales = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const inDelivery = req.filterDelivery; // CHECK IF THE FILTER IN_DELIVERY IS ACTIVE
    try {
        const sales = yield saleService.getSales(inDelivery); // FIND ALL SALES WITH SALESERVICE
        res.status(200).json({ ok: true, data: sales }); // RETURNS STATUS 200 AND THE SALES
    }
    catch (error) {
        next(error);
    }
});
exports.getAllSales = getAllSales;
const getSalesByClientName = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const inDelivery = req.filterDelivery; // CHECK IF THE FILTER IN_DELIVERY IS ACTIVE
    const clientName = req.params.clientName; // GET THE CLIENT NAME FROM THE REQUEST PARAMS    
    try {
        const sales = yield saleService.findSalesByClientName(inDelivery, clientName); // FIND ALL SALES BY CLIENT NAME WITH SALE SERVICE
        res.status(200).json({ ok: true, data: sales }); // RETURN STATUS 200 AND THE SALES
    }
    catch (error) {
        next(error);
    }
});
exports.getSalesByClientName = getSalesByClientName;
const getSalesBySaleDate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const inDelivery = req.filterDelivery; // CHECK IF THE FILTER IN_DELIVERY IS ACTIVE
    const { date } = req.query; // GET THE SALE DATE FROM THE REQUEST PARAMS        
    try {
        const sales = yield saleService.findSalesBySaleDate(inDelivery, date); // FIND ALL SALES BY SALE DATE WITH SALE SERVICE
        res.status(200).json({ ok: true, data: sales }); // RETURN STATUS 200 AND THE SALES
    }
    catch (error) {
        next(error);
    }
});
exports.getSalesBySaleDate = getSalesBySaleDate;
const registerSale = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const sale = req.body; // GET THE SALE TO CREATE FROM DE REQUEST
    try {
        const newSale = yield saleService.createSale(sale); // CREATE THE NEW SALE
        res.status(201).json({ ok: true, data: newSale }); //RETURNS STATUS 201 AND THE SALE CREATED
    }
    catch (error) {
        next(error);
    }
});
exports.registerSale = registerSale;
const updateSale = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const sale = req.body; // GET THE SALE TO UPDATE FROM THE REQUEST
    try {
        const saleUpdated = yield saleService.getSaleUpdated(sale); // UPDATE THE SALE WITH SALESERVIECE
        res.status(200).json({ ok: true, data: saleUpdated }); // RETURNS STATUS 200 AND THE SALE UPDATED
    }
    catch (error) {
        next(error);
    }
});
exports.updateSale = updateSale;
const deleteSale = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const saleId = req.params.saleId; // GET THE SALE ID FROM THE REQUEST PARAMS
    try {
        yield saleService.removeSale(saleId); // DELETE THE SALE BY HIS ID WITH SALE SERVICE
        res.status(204).json({ ok: true }); // RETURNS STATUS 204 AND OK = TRUE
    }
    catch (error) {
        next(error);
    }
});
exports.deleteSale = deleteSale;
