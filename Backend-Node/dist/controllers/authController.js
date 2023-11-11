"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getAllUsers = exports.updateUser = exports.registerUser = exports.logout = exports.login = void 0;
const authService = __importStar(require("../services/authService"));
/////////////////////////
// USER CONTROLLER
///////////////////////
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body; // GET THE EMAIL AND PASSWORD FROM THE REQUEST
    try {
        const token = yield authService.loginUser(email, password); // GET THE TOKEN FROM THE AUTHSERVICE
        if (token) { // IF TOKEN EXISTS THEN SET THE COOKIE IN THE RESPONSE
            res
                .cookie("jwt", token, {
                //       1s    1m   1h   1d
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true //  the cookie is not reachable from client side
            })
                .status(200)
                .json({ ok: true, message: "Login successful" });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const logout = (req, res, next) => {
    try {
        if (req.cookies.jwt) { // CHECK IF EXISTS A COOKIE
            res.clearCookie("jwt"); // Clear the cookie JWT
            res.status(200).json({ ok: true, message: "Logout successful" });
        }
        else {
            res.status(200).json({ ok: true, message: "No active session" });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body; // GET THE USER TO CREATE FROM REQUEST
    try {
        const newUser = yield authService.createUser(user); // CREATE THE NEW USER WITH AUTHSERVICE 
        res.status(201).json({ ok: true, data: newUser }); // RETURN STATUS 200 AND THE NEW USER IN THE DATA
    }
    catch (error) {
        next(error);
    }
});
exports.registerUser = registerUser;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body; // GET THE USER TO UPDATE FROM REQUEST
    try {
        const userUpdated = yield authService.updateUser(user); // UPDATE THE USER WITH AUTHSERVICE
        res.status(200).json({ ok: true, data: userUpdated }); // RETURN STATUS 200 AND THE USER UPDATED
    }
    catch (error) {
        next(error);
    }
});
exports.updateUser = updateUser;
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield authService.getAllUsers(); // THE THE ALL USERS WITH AUTHSERVICE
        res.status(200).json({ ok: true, data: users }); // RETURN STATUS 200 AND THE USERS FOUND
    }
    catch (error) {
        next(error);
    }
});
exports.getAllUsers = getAllUsers;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId; // GET THE USER ID FROM THE PARAMS
    try {
        yield authService.removeUser(userId); // DELETE THE USER WITH AUTHSERVICE
        res.status(204).json({ ok: true });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUser = deleteUser;
