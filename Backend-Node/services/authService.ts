import UserModel from "../models/user"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { BadRequest, CheckCredentials, InternalServer, UserAlreadyRegistered, UserNotFound } from "../errors/errorMessages"
import { User, UserMongo } from "../schemas/authSchemas"
import { AuthenticationError, BadRequestError, ResourceAlreadyRegisteredError, ResourceNotFoundError } from "../errors/customErrors"
import { errorsPitcher } from "../errors/errorsPitcher"
import { existsEntity } from "../utils/existingChecker"
import ClientModel from "../models/client"


/////////////////////////
// USER SERVICE
///////////////////////


export const loginUser = async (email: string, password: string) => {
    try{
        const user = await UserModel.findOne({email: email})

        if(!user) { // IF CAN NOT FOUND THE USER RUN AN EXCEPTION
            throw new ResourceNotFoundError(UserNotFound);
        }
        const passwordMatch = await bcrypt.compare(password, user.password) // CHECK IF THE PASSWORD IS MATCH
        if(!passwordMatch){ // IF THE PASSWORD IS NOT MATCH RUN AN EXCEPTION
            throw new AuthenticationError(CheckCredentials)
        }
        const token = jwt.sign(
            {sub: user._id, role: user.role}, 
            process.env.SECRET_KEY_SIGN as string
        )

        return token
    } catch (error){
        errorsPitcher(error)
    }
}


export const createUser = async (newUser : User) => {
    const {username, email, password, role} = newUser // GET THE ATTRIBUTES SENDED 
    
    if(await existsEntity(ClientModel, "email", email)){ // IF EMAIL HAS ALREADY BEEN REGISTERED RUN AN EXCEPTION        
        throw new ResourceAlreadyRegisteredError(UserAlreadyRegistered)
    } else{
        const hashPassword = await bcrypt.hash(password, 8) // PASSWORD TO HASH
        try{
            const newUser = await UserModel.create({ // CREATE THE NEW USER AND SEND IT
                username: username, 
                email: email, 
                password: hashPassword, 
                role: role
            })  
            return newUser
        } catch (error){
            throw new BadRequestError(BadRequest)
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
            throw new BadRequestError(InternalServer)
        }
    } else{
        throw new ResourceNotFoundError(UserNotFound)
    }
}

export const getAllUsers = async () => {
    try{
        const users = await UserModel.find() // GET ALL USERS , IF ARRAY LENGTHS IF MORE THAT 0 RETURN USER ELSE RETURN ERROR
        if (users.length > 0){
            return users
        } else {
            throw new ResourceNotFoundError(UserNotFound)
        }
    } catch(error){
        errorsPitcher(error)
    }
    
}

export const removeUser = async (userId: string) => {
    try{
        const userSaved = await UserModel.findById(userId) // CHECK IF EXISTS TH CLIENT 
        if(!userSaved){
            throw new ResourceNotFoundError(UserNotFound)
        }
        await UserModel.findByIdAndDelete(userId) // IF EXISTS, THEN DELETE IT
    } catch (error){ 
        errorsPitcher(error)
    }
}