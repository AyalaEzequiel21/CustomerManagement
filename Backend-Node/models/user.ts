import { Schema, model } from "mongoose";
import { ERole } from "../enums/ERole";

const userSchema = new Schema({
    username: {type: String, required: true},
    email: { type: String, unique: true, required: true},
    password: { type: String, required: true, length: 8},
    role: {type: String, enum: ERole, required: true}
})
const UserModel = model("User", userSchema, "users")

export default UserModel