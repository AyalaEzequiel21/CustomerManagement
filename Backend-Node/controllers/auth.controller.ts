import { Request, Response } from "express"
import bcrypt from 'bcrypt'
import UserSchema from '../models/user'

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body

    const user = await UserSchema.findOne({email: email})
    if(user){
        const passwordMatch = bcrypt.compareSync(password, user.password as string)
        if(passwordMatch){
            console.log("logueado");
            
            res.status(200).send("logueado")
        }
    }else{
        res.status(404).send("user not found")
    }
}

export const generateCode = (req: Request, res: Response) => {
    res.send("CODE GENERATED")
}