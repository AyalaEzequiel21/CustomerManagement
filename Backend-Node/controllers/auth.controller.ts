import { Request, Response } from "express"
import * as authService from '../services/authService'


/////////////////////////
// USER CONTROLLER
///////////////////////

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body // GET THE EMAIL AND PASSWORD FROM THE REQUEST
    const token = await authService.loginUser(email, password) // GET THE TOKEN FROM THE AUTHSERVICE
        if (token){ // IF TOKEN EXISTS THEN SET THE COOKIE IN THE RESPONSE
            res
                .cookie("jwt", token,{
                    //       1s    1m   1h   1d
                    maxAge: 1000 * 60 * 60 * 24 // TIME EXPIRATION
                })
                .status(200)
                .json({ok: true, message: "Login successful"})
        } 
}

export const logout = (req: Request, res: Response) => {
    if(req.cookies.jwt){ // CHECK IF EXISTS A COOKIE
        res.clearCookie("jwt"); // Clear the cookie JWT
        res.status(200).json({ ok: true, message: "Logout successful" });
    } else {
        res.status(200).json({ ok: true, message: "No active session" });
    }
}

export const registerUser = async (req: Request, res: Response) => {
    const user = req.body // GET THE USER TO CREATE FROM REQUEST
    const newUser = await authService.createUser(user) // CREATE THE NEW USER WITH AUTHSERVICE 
    res.status(201).json({ok: true, data: newUser}) // RETURN STATUS 200 AND THE NEW USER IN THE DATA
}

export const updateUser = async (req: Request, res: Response) => {
    const user = req.body // GET THE USER TO UPDATE FROM REQUEST
    const userUpdated = await authService.updateUser(user) // UPDATE THE USER WITH AUTHSERVICE
    res.status(200).json({ok: true, data: userUpdated}) // RETURN STATUS 200 AND THE USER UPDATED
}

export const getAllUsers = async (req: Request, res: Response) => {
    const users = await authService.getAllUsers() // THE THE ALL USERS WITH AUTHSERVICE
    res.status(200).json({ok: true, data: users}) // RETURN STATUS 200 AND THE USERS FOUND
}

export const deleteUser = async (req: Request, res: Response) => {
    const userId = req.params.id // GET THE USER ID FROM THE PARAMS
    await authService.removeUser(userId) // DELETE THE USER WITH AUTHSERVICE
    res.status(204).json({ok: true})
}