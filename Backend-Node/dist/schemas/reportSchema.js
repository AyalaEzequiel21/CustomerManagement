"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportMongoSchema = exports.reportRegistrationSchema = void 0;
const zod_1 = require("zod");
const paymentSchema_1 = require("./paymentSchema");
const paymentDTOSchema_1 = require("./dtos/paymentDTOSchema");
// REPORT 
exports.reportRegistrationSchema = zod_1.z.object({
    payments: zod_1.z.array(paymentSchema_1.paymentRegistrationSchema).optional(),
    payments_dto: zod_1.z.array(paymentDTOSchema_1.paymentDTOSchema)
});
// REPORT MONGO 
exports.reportMongoSchema = exports.reportRegistrationSchema.extend({
    _id: zod_1.z.string(),
    report_date: zod_1.z.string().optional(),
    report_status: zod_1.z.string()
});
