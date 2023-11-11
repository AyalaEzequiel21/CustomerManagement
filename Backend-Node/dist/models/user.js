"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ERole_1 = require("../enums/ERole");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, length: 8 },
    role: { type: String, enum: ERole_1.ERole, required: true }
});
const UserModel = (0, mongoose_1.model)("User", userSchema, "users");
exports.default = UserModel;
