"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSession = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
// config dotenv
dotenv_1.default.config();
// funtion to connect
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.MONGODB_URL) {
            throw new Error("Falta la variable de entorno MONGODB_URL");
        }
        try {
            yield mongoose_1.default.connect(process.env.MONGODB_URL, {
                retryWrites: true,
                w: "majority",
            });
            console.log("connection succesful");
        }
        catch (error) {
            console.log("Error to connect Data Base, " + error);
        }
    });
}
exports.connectDB = connectDB;
function startSession() {
    return __awaiter(this, void 0, void 0, function* () {
        return mongoose_1.default.startSession();
    });
}
exports.startSession = startSession;
