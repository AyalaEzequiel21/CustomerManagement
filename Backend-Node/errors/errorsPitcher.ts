import mongoose from "mongoose";
import { AuthenticationError, BadRequestError, InternalServerError, ResourceAlreadyRegisteredError, ResourceNotFoundError } from "./customErrors";
import { BadRequest, InternalServer } from "./errorMessages";

export const errorsPitcher = (error : Error | unknown) => {
    console.log(error);
    
    if (error instanceof Error){
        switch (true) {
            case error instanceof AuthenticationError: 
                throw new AuthenticationError(error.message)
            case error instanceof ResourceNotFoundError: 
                throw new ResourceNotFoundError(error.message)
            case error instanceof BadRequestError: 
                throw new BadRequestError(error.message)
            case error instanceof ResourceAlreadyRegisteredError:
                throw new ResourceAlreadyRegisteredError(error.message)
            case error instanceof mongoose.Error.ValidationError:
                // Mongoose validation error, handle it differently
                const validationErrors = Object.values(error)
                    .map((err: mongoose.Error.ValidatorError) => err.message);
                throw new BadRequestError(BadRequest);
    
            default:
                throw new InternalServerError(`${InternalServer}:  ${error.message}`)
        }
    } else {        
        throw new InternalServerError(`${InternalServer}:  ${error}`)
    }
}