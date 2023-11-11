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
Object.defineProperty(exports, "__esModule", { value: true });
exports.detailSaleSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const dateUtils_1 = require("../utils/dateUtils");
exports.detailSaleSchema = new mongoose_1.Schema({
    product: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, min: 0.01, required: true },
    partialResult: { type: Number, min: 0.01, required: true }
});
const saleSchema = new mongoose_1.Schema({
    sale_date: { type: String, default: (0, dateUtils_1.formatDateIso)(new Date()) },
    clientId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Client", required: true },
    clientName: { type: String, required: true },
    details: [exports.detailSaleSchema],
    totalSale: { type: Number, min: 0.01, required: true },
    payment: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Payment" }
});
const SaleModel = (0, mongoose_1.model)("Sale", saleSchema, "sales");
exports.default = SaleModel;
