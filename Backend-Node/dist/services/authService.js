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
exports.removeUser = exports.getAllUsers = exports.updateUser = exports.createUser = exports.loginUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorMessages_1 = require("../errors/errorMessages");
const customErrors_1 = require("../errors/customErrors");
const errorsPitcher_1 = require("../errors/errorsPitcher");
const existingChecker_1 = require("../utils/existingChecker");
const client_1 = __importDefault(require("../models/client"));
/////////////////////////
// USER SERVICE
///////////////////////
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findOne({ email: email });
        if (!user) { // IF CAN NOT FOUND THE USER RUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.UserNotFound);
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password); // CHECK IF THE PASSWORD IS MATCH
        if (!passwordMatch) { // IF THE PASSWORD IS NOT MATCH RUN AN EXCEPTION
            throw new customErrors_1.AuthenticationError(errorMessages_1.CheckCredentials);
        }
        const token = jsonwebtoken_1.default.sign({ sub: user._id, role: user.role }, process.env.SECRET_KEY_SIGN);
        return token;
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.loginUser = loginUser;
const createUser = (newUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, role } = newUser; // GET THE ATTRIBUTES SENDED 
    try {
        if (yield (0, existingChecker_1.existsEntity)(client_1.default, "email", email)) { // IF EMAIL HAS ALREADY BEEN REGISTERED RUN AN EXCEPTION        
            throw new customErrors_1.ResourceAlreadyRegisteredError(errorMessages_1.UserAlreadyRegistered);
        }
        const hashPassword = yield bcrypt_1.default.hash(password, 8); // PASSWORD TO HASH
        const newUser = yield user_1.default.create({
            username: username,
            email: email,
            password: hashPassword,
            role: role
        });
        if (!newUser) {
            throw new customErrors_1.BadRequestError(errorMessages_1.BadRequest);
        }
        return newUser; //  RETURNS THE NEW USER
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.createUser = createUser;
const updateUser = (userUpdated) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, username, email, password, role } = userUpdated; // GET THE ATTRIBUTES SENDED
    try {
        const existingUser = yield user_1.default.findById(_id); // CHECK THAT EXISTS THE USER SENDED
        if (!existingUser) { // IF USER NOT EXISTS RUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.UserNotFound);
        }
        existingUser.username = username; // ELSE UPDATE THE USER 
        existingUser.email = email;
        existingUser.password = bcrypt_1.default.hashSync(password, 8);
        existingUser.role = role;
        const updatedUser = yield existingUser.save(); // SAVE THE USER UPDATED AND RETURN
        if (!exports.updateUser) {
            throw new customErrors_1.BadRequestError(errorMessages_1.BadRequest);
        }
        return updatedUser;
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.updateUser = updateUser;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find(); // GET ALL USERS , IF ARRAY IS NOT EMPTY RETURNS USER ELSE RETURN ERROR
        if ((0, existingChecker_1.isEmptyList)(users)) {
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.UserNotFound);
        }
        return users;
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.getAllUsers = getAllUsers;
const removeUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userSaved = yield user_1.default.exists({ _id: userId }); // CHECK IF EXISTS TH CLIENT 
        if (!userSaved) {
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.UserNotFound);
        }
        yield user_1.default.deleteOne({ _id: userId }); // IF EXISTS, THEN DELETE IT
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.removeUser = removeUser;
