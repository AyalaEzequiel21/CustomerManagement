"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productMongoSchema = exports.productRegistrationSchema = void 0;
const zod_1 = require("zod");
// PRODUCT
exports.productRegistrationSchema = zod_1.z.object({
    productName: zod_1.z.string().min(3).max(25),
    price_cat_1: zod_1.z.number().refine(value => value > 0, { message: "The price must be more that 0" }),
    price_cat_2: zod_1.z.number().refine(value => value > 0, { message: "The price must be more that 0" })
});
// PRODUCT MONGO
exports.productMongoSchema = exports.productRegistrationSchema.extend({
    _id: zod_1.z.string(),
    is_active: zod_1.z.boolean()
});
