import { Request, Response } from "express"
import * as authService from '../services/authService'
import mongoose from "mongoose"

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
    } else {
        res
            .status(404)
            .json({ok: false, message: "User not found"})
    }
}

export const logout = (req: Request, res: Response) => {
    res.clearCookie("jwt") // CLEAR THE COOKIE JWT

    res.status(200).json({ok: true, message: "Logout successful"})
}

export const registerUser = async (req: Request, res: Response) => {
    const user = req.body // GET THE USER TO CREATE FROM REQUEST
    try {
        const newUser = await authService.createUser(user) // CREATE THE NEW USER WITH AUTHSERVICE 
        res.status(201).json({ok: true, data: newUser}) // RETURN STATUS 200 AND THE NEW USER IN THE DATA
    }catch (error){
        res.status(400).json({ok: false, message: `Cannot create the new user, error: ${error}`})
    }
}

export const updateUser = async (req: Request, res: Response) => {
    const user = req.body // GET THE USER TO UPDATE FROM REQUEST
    try{
        const userUpdated = await authService.updateUser(user) // UPDATE THE USER WITH AUTHSERVICE
        res.status(200).json({ok: true, data: userUpdated}) // RETURN STATUS 200 AND THE USER UPDATED
    } catch(error) {
        if (error  === 'User not found') {
            res.status(404).json({ ok: false, message: error });
          } 
          else if (error instanceof mongoose.Error.CastError) {
            res.status(400).json({ ok: false, message: 'User invalid' });
          } 
          else {
            res.status(500).json({ ok: false, message: 'Error del servidor' });            
          }    
    }
}

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await authService.getAllUsers() // THE THE ALL USERS WITH AUTHSERVICE
        res.status(200).json({ok: true, data: users}) // RETURN STATUS 200 AND THE USERS FOUND
    } catch (error) {
        res.status(404).json({ok: true, message: error})
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const userId = req.params.id // GET THE USER ID FROM THE PARAMS
    try {
        await authService.removeUser(userId) // DELETE THE USER WITH AUTHSERVICE
        res.status(204).json({ok: true})
    } catch (error){
        res.status(404).json({ok: false, message: error});
    }
    
}