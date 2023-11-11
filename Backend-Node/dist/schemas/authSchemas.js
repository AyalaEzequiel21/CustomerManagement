"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginDataSchema = exports.userCookieSchema = exports.userMongoSchema = exports.userRegistrationSchema = void 0;
const zod_1 = require("zod");
const ERole_1 = require("../enums/ERole");
// USER
exports.userRegistrationSchema = zod_1.z.object({
    username: zod_1.z.string().min(3),
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
    role: zod_1.z.nativeEnum(ERole_1.ERole)
});
// USER MONGO
exports.userMongoSchema = exports.userRegistrationSchema.extend({
    _id: zod_1.z.string()
});
// USER COOKIE
exports.userCookieSchema = zod_1.z.object({
    sub: zod_1.z.string(),
    role: zod_1.z.nativeEnum(ERole_1.ERole)
});
// LOGIN DATA
exports.loginDataSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
});
