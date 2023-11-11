"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorsPitcher = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const customErrors_1 = require("./customErrors");
const errorMessages_1 = require("./errorMessages");
const errorsPitcher = (error) => {
    console.log(error);
    if (error instanceof Error) {
        switch (true) {
            case error instanceof customErrors_1.AuthenticationError:
                throw new customErrors_1.AuthenticationError(error.message);
            case error instanceof customErrors_1.ResourceNotFoundError:
                throw new customErrors_1.ResourceNotFoundError(error.message);
            case error instanceof customErrors_1.BadRequestError:
                throw new customErrors_1.BadRequestError(error.message);
            case error instanceof customErrors_1.ResourceAlreadyRegisteredError:
                throw new customErrors_1.ResourceAlreadyRegisteredError(error.message);
            case error instanceof mongoose_1.default.Error.ValidationError:
                // Mongoose validation error, handle it differently
                const validationErrors = Object.values(error)
                    .map((err) => err.message);
                throw new customErrors_1.BadRequestError(errorMessages_1.BadRequest);
            default:
                throw new customErrors_1.InternalServerError(`${errorMessages_1.InternalServer}:  ${error.message}`);
        }
    }
    else {
        throw new customErrors_1.InternalServerError(`${errorMessages_1.InternalServer}:  ${error}`);
    }
};
exports.errorsPitcher = errorsPitcher;
