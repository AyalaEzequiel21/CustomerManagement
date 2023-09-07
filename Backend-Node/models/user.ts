import { Schema, model } from "mongoose";

const userSchema = new Schema({
    username: {type: String, unique: true, require: true},
    email: { type: String, unique: true, require: true},
    password: { type: String, require: true, length: 8},
    roles: {type: {
        admin: Boolean,
        biller: Boolean,
        delivery: Boolean
    }, require: true}
})

export default model("User", userSchema, "users")