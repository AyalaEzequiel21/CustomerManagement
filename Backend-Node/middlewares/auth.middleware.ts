import { NextFunction, Request, Response } from 'express'
import jwt, {JsonWebTokenError, TokenExpiredError} from 'jsonwebtoken'
import { ERole } from '../enums/ERole'
import { User } from '../utils/interfaces/user.interface'

const getCookiesUser = (req: any) => {
    const token = req.cookies.jwt
    const user = jwt.verify(token, process.env.SECRET_KEY_SIGN as string)
    if (!user) {
        throw new Error("Not authorizated")
    }
    return user
}

export const validateUser = () => {
  
    return (req: any, res: Response, next: NextFunction) => {
        try {
            const user = getCookiesUser(req)

            req.user = user
            console.log("usuario validado");
            
            next()
        } catch (error) {
            if(error instanceof JsonWebTokenError || error instanceof TokenExpiredError){
                res.status(401).json({ok: false, message: error.message})
            }
            res.status(500).json({ok: false, message: "error del servidor"})
        }
    }
}

export const validateRoleUser = (allowedRoles: ERole[] = []) => {
    
    return (req: any, res: Response, next: NextFunction) => {

        const user = getCookiesUser(req) as User


        if(allowedRoles.length > 0 && !allowedRoles.includes(user.role)){
                
            res.status(403).json({ ok: false, message: 'Unauthorized access' });
        }

        next()
    }
}