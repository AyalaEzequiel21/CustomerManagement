"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientMongoSchema = exports.clientRegistrationSchema = void 0;
const zod_1 = require("zod");
const ECategory_1 = require("../enums/ECategory");
// CLIENT 
exports.clientRegistrationSchema = zod_1.z.object({
    fullname: zod_1.z.string().min(3).max(25),
    phone: zod_1.z.string().min(8).max(15),
    category: zod_1.z.nativeEnum(ECategory_1.ECategory),
    in_delivery: zod_1.z.boolean()
});
//  CLIENT MONGO
exports.clientMongoSchema = exports.clientRegistrationSchema.extend({
    _id: zod_1.z.string(),
    register_date: zod_1.z.string().optional(),
    balance: zod_1.z.number().optional(),
    sales: zod_1.z.array(zod_1.z.string()).optional(),
    payments: zod_1.z.array(zod_1.z.string()).optional(),
    is_active: zod_1.z.boolean()
});
