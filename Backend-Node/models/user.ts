import { Schema, model } from "mongoose";
import { ERole } from "../enums/ERole";

const userSchema = new Schema({
    username: {type: String, unique: true, require: true},
    email: { type: String, unique: true, require: true},
    password: { type: String, require: true, length: 8},
    roles: {type: String, enum: ERole, require: true}
})
const UserModel = model("User", userSchema, "users")

export default UserModel