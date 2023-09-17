import UserModel from "../models/user"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User, UserMongo } from "../utils/interfaces/user.interface"


/////////////////////////
// USER SERVICE
///////////////////////

// function to validate that the same email is not registered twice
const existsEmail = async (email: string) => {
    let response = false
    const userId = await UserModel.exists({email: email})
    if(userId){
        response = true
    } 
    return response
}


export const loginUser = async (email: string, password: string) => {
    const user = await UserModel.findOne({email: email}) // GET THE USER SAVED 
    if(user){
        const passwordMatch = bcrypt.compareSync(password, user.password)  // CHECK IF THE PASSWORD IS MATCH
        if(passwordMatch){ // IF THE PASSWORD IS MATCH THEN SIGN THE TOKEN AND SEND IT ELSE RETURN NULL
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
    const {username, email, password, role} = newUser // GET THE ATTRIBUTES SENDED 
    
    if(await existsEmail(email)){ // IF EMAIL HAS ALREADY BEEN REGISTERED RUN AN EXCEPTION
        throw new Error("The email has already been registered")
    } else{
        const hashPassword = bcrypt.hashSync(password, 8) // PASSWORD TO HASH
        try{
            const newUser = UserModel.create({ // CREATE THE NEW USER AND SEND IT
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
    
}

export const updateUser = async (userUpdated: UserMongo) => {
    const {_id, username, email, password, role} = userUpdated // GET THE ATTRIBUTES SENDED
    
    const existingUser = await UserModel.findById(_id) // CHECK THAT EXISTS THE USER SENDED

    if(existingUser){ // IF EXISTS THEN UPDATE
        existingUser.username = username
        existingUser.email = email
        existingUser.password = bcrypt.hashSync(password, 8)
        existingUser.role = role

        try{
            const updatedUser = await existingUser.save() // SAVE THE USER UPDATED AND SEND IT
            return updatedUser
        } catch (error){
            throw new Error("A problem has occurred")
        }
    } else{
        throw new Error("User not found")
    }
}

export const getAllUsers = async () => {
    const users = await UserModel.find() // GET ALL USERS , IF ARRAY LENGTHS IF MORE THAT 0 RETURN USER ELSE RETURN ERROR
    if (users.length != 0){
        return users
    } else {
        throw new Error("Users not found")
    }
}

export const removeUser = async (userId: string) => {
    try{
        await UserModel.findByIdAndDelete(userId) // FIND THE USER AND DELETE
    } catch (error){ 
       throw new Error("User not found")
    }
}