"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentMongoSchema = exports.paymentRegistrationSchema = void 0;
const zod_1 = require("zod");
const EPaymentMethod_1 = require("../enums/EPaymentMethod");
// PAYMENT
exports.paymentRegistrationSchema = zod_1.z.object({
    clientId: zod_1.z.string(),
    amount: zod_1.z.number().refine(value => value > 0, { message: "The amount must be more that 0" }),
    payment_method: zod_1.z.nativeEnum(EPaymentMethod_1.EPaymentMethod),
    saleId: zod_1.z.string().optional(),
    reportId: zod_1.z.string().optional()
});
// PAYMENT MONGO 
exports.paymentMongoSchema = exports.paymentRegistrationSchema.extend({
    _id: zod_1.z.string()
});
