import { Request, Response } from "express"
import * as authService from '../services/authService'

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body

    const token = await authService.loginUser(email, password)
    if (token){
        res
            .cookie("jwt", token,{
                //       1s    1m   1h   1d
                maxAge: 1000 * 60 * 60 * 24
            })
            .status(200)
            .json({ok: true, message: "Login successful"})
    } else {
        res
            .status(404)
            .json({ok: false, message: "User not found"})
    }
}

export const logout = (req: Request, res: Response) => {
    res.clearCookie("jwt")

    res.status(200).json({ok: true, message: "Logout successful"})
}

export const register = async (req: Request, res: Response) => {
    const {username, email, password, role} = req.body
    try {
        const newUser = await authService.createUser({username, email, password, role})
        res.status(201).json({ok: true, data: newUser})
    }catch (error){
        res.status(400).json({ok: true, message: `Cannot create the new user, erro: ${error}`})
    }
}

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await authService.getAllUsers()
        res.status(200).json({ok: true, data: users})
    } catch (error) {
        res.status(404).json({ok: true, message: error})
    }
}