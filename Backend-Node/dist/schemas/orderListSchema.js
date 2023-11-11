"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderListMongoSchema = exports.orderListRegistrationSchema = void 0;
const zod_1 = require("zod");
// ORDER LIST
const detailOrder = zod_1.z.object({
    saleId: zod_1.z.string(),
    clientName: zod_1.z.string(),
    totalSale: zod_1.z.number().min(0.01)
});
exports.orderListRegistrationSchema = zod_1.z.object({
    sales: zod_1.z.array(detailOrder)
});
// ORDER LIST MONGO
exports.orderListMongoSchema = exports.orderListRegistrationSchema.extend({
    _id: zod_1.z.string(),
    order_date: zod_1.z.string().optional(),
    order_status: zod_1.z.string()
});
