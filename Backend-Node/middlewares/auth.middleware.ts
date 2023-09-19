import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { ERole } from '../enums/ERole'
import z from "zod"
import { BadRequest, InternalServer, NotAuthorized } from '../errors/errorMessages'
import { UserCookie } from '../schemas/authSchemas'
import { AuthenticationError, BadRequestError, InternalServerError } from '../errors/customErrors'


// check if exists an user in the cookie
const getCookiesUser = (req: Request) => {
    const token = req.cookies.jwt
    const user = jwt.verify(token, process.env.SECRET_KEY_SIGN as string) as UserCookie
    if (!user) {
        throw new AuthenticationError(NotAuthorized)
    }
    return user
}

// get the user saved in the cookie
export const validateUser = () => { 
    return (req: any, res: Response, next: NextFunction) => {
        try {
            const user = getCookiesUser(req)
            req.user = user
            console.log("usuario validado")
            next()
        } catch (error) {
            throw new AuthenticationError(NotAuthorized)   
        }
    }
}

// validate that the user have a role allowed

export const validateRoleUser = (allowedRoles: ERole[] = []) => {
    
    return (req: any, res: Response, next: NextFunction) => {

        const user = req.user

        if(allowedRoles.length > 0 && !allowedRoles.includes(user.role)){
            throw new AuthenticationError(NotAuthorized)
        }
        next()
    }
}

// check that request body matched with schema default
export const validateSchemaRequest = (schema: z.ZodType<any>) => {

    return (req: Request, res: Response, next: NextFunction) => {
        try{
            const validatedData = schema.parse(req.body)
            req.body = validatedData
            next()
        } catch (error){

            if (error instanceof z.ZodError){
                throw new BadRequestError(BadRequest)
            }
            throw new InternalServerError(InternalServer)
        }
    }
}