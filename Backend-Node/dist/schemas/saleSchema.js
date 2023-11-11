"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saleMongoSchema = exports.saleRegistrationSchema = exports.detailSaleSchema = void 0;
const zod_1 = require("zod");
const paymentDTOSchema_1 = require("./dtos/paymentDTOSchema");
// DETAIL SALE
exports.detailSaleSchema = zod_1.z.object({
    product: zod_1.z.string(),
    quantity: zod_1.z.number().refine(value => value > 0, { message: "The amount must be more that 0" }),
    partialResult: zod_1.z.number().refine(value => value > 0, { message: "The amount must be more that 0" })
});
// SALE
exports.saleRegistrationSchema = zod_1.z.object({
    clientId: zod_1.z.string().optional(),
    clientName: zod_1.z.string(),
    details: zod_1.z.array(exports.detailSaleSchema),
    totalSale: zod_1.z.number().optional(),
    payment_dto: paymentDTOSchema_1.paymentDTOSchema.optional(),
    payment: zod_1.z.string().optional()
});
// SALE MONGO
exports.saleMongoSchema = exports.saleRegistrationSchema.extend({
    _id: zod_1.z.string(),
    sale_date: zod_1.z.string()
});
