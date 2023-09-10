import { Request, Response } from "express"
import bcrypt from 'bcrypt'
import UserSchema from '../models/user'
import jwt from 'jsonwebtoken'

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body

    const user = await UserSchema.findOne({email: email})
    if(user){
        const passwordMatch = bcrypt.compareSync(password, user.password as string)
        if(passwordMatch){
            const token = jwt.sign({sub: user._id, email: user.email}, process.env.SECRET_KEY_SIGN as string)
            console.log("logueado");
            res.cookie("jwt", token)
            res.status(200).json({ok: true, message: "Inicio de session exitoso"})
        }
    }else{
        res.status(404).send("user not found")
    }
}
