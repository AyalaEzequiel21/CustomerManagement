"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentDTOSchema = void 0;
const zod_1 = require("zod");
const EPaymentMethod_1 = require("../../enums/EPaymentMethod");
exports.paymentDTOSchema = zod_1.z.object({
    clientId: zod_1.z.string(),
    amount: zod_1.z.number().refine(value => value > 0, { message: "The amount must be more that 0" }),
    payment_method: zod_1.z.nativeEnum(EPaymentMethod_1.EPaymentMethod)
});
