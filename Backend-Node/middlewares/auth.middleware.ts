import { NextFunction, Request, Response } from 'express'
import jwt, {JsonWebTokenError, TokenExpiredError} from 'jsonwebtoken'
import { ERole } from '../enums/ERole'
import z from "zod"
import { BadRequest, CheckCredentials, InternalServer, NotAuthorized } from '../errors/errorMessages'
import { UserCookie } from '../schemas/authSchemas'
import { AuthenticationError, BadRequestError, InternalServerError } from '../errors/customErrors'


interface CustomRequest extends Request {
    user: UserCookie
}

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
            console.log("usuario validado");
            
            next()
        } catch (error) {
            if(error instanceof JsonWebTokenError || error instanceof TokenExpiredError || error instanceof AuthenticationError){
                throw new AuthenticationError(NotAuthorized)
                
            }else {
                throw new InternalServerError(InternalServer)
            }
        }
    }
}

// validate that the user have a role allowed

export const validateRoleUser = (allowedRoles: ERole[] = []) => {
    
    return (req: Request, res: Response, next: NextFunction) => {

        const user = getCookiesUser(req)

        if(allowedRoles.length > 0 && !allowedRoles.includes(user.role)){
            return next(new AuthenticationError(CheckCredentials));
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
        }
    }
}