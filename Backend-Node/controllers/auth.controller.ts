import { Request, Response } from "express"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserModel from "../models/user"

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body

    const user = await UserModel.findOne({email: email})
    if(user){
        const passwordMatch = bcrypt.compareSync(password, user.password as string)
        if(passwordMatch){
            const token = jwt.sign({sub: user._id, email: user.email}, process.env.SECRET_KEY_SIGN as string)
            console.log("logueado");
            res
                .cookie("jwt", token)
                .status(200)
                .json({ok: true, message: "Inicio de session exitoso"})
        }
    }else{
        res.status(404).send("user not found")
    }
}

export const register = async (req: Request, res: Response) => {
    const {username, email, password, role} = req.body
    const hashPassword = bcrypt.hashSync(password, 8)
    try {
        const newUser = await UserModel.create({username: username, email: email, password: hashPassword, role: role})
        res.status(201).json({ok: true, data: newUser})
    } catch (error) {
        res.status(401).json({ok: false, message: "Can't create the new user"}) 
    }
}

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find()
        res.status(200).json({ok: true, data: users})
    } catch (error) {
        res.status(404).json({ok: true, message: "Users not found"})
    }
}