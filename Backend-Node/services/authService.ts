import UserModel from "../models/user"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from "../utils/interfaces/user.interface"

const validateEmail = async (email: string) => {
    const userId = await UserModel.exists({email: email})
    if(userId){
        throw new Error("The email has already been registered")
    }
}


export const loginUser = async (email: string, password: string) => {
    const user = await UserModel.findOne({email: email})
    if(user){
        const passwordMatch = bcrypt.compareSync(password, user.password)
        if(passwordMatch){
            const token = jwt.sign(
                { sub: user._id, email: user.email, role: user.role},
                process.env.SECRET_KEY_SIGN as string
            );
            return token
        }
    }
    return null
}


export const createUser = async (newUser : User) => {
    const {username, email, password, role} = newUser
    validateEmail(email)
    const hashPassword = bcrypt.hashSync(password, 8)
    try{
        const newUser = UserModel.create({
            username: username, 
            email: email, 
            password: hashPassword, 
            role: role
        })
        return newUser
    } catch (error){
        throw new Error("A problem has occurred")
    }
}

export const getAllUsers = async () => {
    const users = await UserModel.find()
    if (users.length != 0){
        return users
    } else {
        throw new Error("Users not found")
    }
}