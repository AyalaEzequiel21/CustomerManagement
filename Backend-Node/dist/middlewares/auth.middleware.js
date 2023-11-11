"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeGetAll = exports.validateSchemaRequest = exports.validateRoleUser = exports.validateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ERole_1 = require("../enums/ERole");
const zod_1 = __importDefault(require("zod"));
const errorMessages_1 = require("../errors/errorMessages");
const customErrors_1 = require("../errors/customErrors");
// check if exists an user in the cookie
const getCookiesUser = (req) => {
    const token = req.cookies.jwt;
    const user = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY_SIGN);
    if (!user) {
        throw new customErrors_1.AuthenticationError(errorMessages_1.NotAuthorized);
    }
    return user;
};
// get the user saved in the cookie
const validateUser = () => {
    return (req, res, next) => {
        try {
            const user = getCookiesUser(req);
            req.user = user;
            console.log("usuario validado");
            next();
        }
        catch (error) {
            throw new customErrors_1.AuthenticationError(errorMessages_1.NotAuthorized);
        }
    };
};
exports.validateUser = validateUser;
// validate that the user have a role allowed
const validateRoleUser = (allowedRoles = []) => {
    return (req, res, next) => {
        const user = req.user;
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
            throw new customErrors_1.AuthenticationError(errorMessages_1.NotAuthorized);
        }
        next();
    };
};
exports.validateRoleUser = validateRoleUser;
// check that request body matched with schema default
const validateSchemaRequest = (schema) => {
    return (req, res, next) => {
        try {
            const validatedData = schema.parse(req.body);
            req.body = validatedData;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.default.ZodError) {
                throw new customErrors_1.BadRequestError(errorMessages_1.BadRequest);
            }
            throw new customErrors_1.InternalServerError(`${errorMessages_1.InternalServer} - ${error}`);
        }
    };
};
exports.validateSchemaRequest = validateSchemaRequest;
// check the user role, if is delivery then filter all the clients 
// and return only clients with in_delivery: true 
const authorizeGetAll = (allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (allowedRoles.includes(user.role)) {
            if (user.role === ERole_1.ERole.Delivery) {
                req.filterDelivery = true;
            }
            else {
                req.filterDelivery = false;
            }
            next();
        }
        else {
            throw new customErrors_1.AuthenticationError(errorMessages_1.NotAuthorized);
        }
    };
};
exports.authorizeGetAll = authorizeGetAll;
