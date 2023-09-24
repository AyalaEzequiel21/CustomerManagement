import { AuthenticationError, BadRequestError, InternalServerError, ResourceAlreadyRegisteredError, ResourceNotFoundError } from "./customErrors";
import { InternalServer } from "./errorMessages";

export const errorsPitcher = (error : Error | unknown) => {
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
    
            default:
                throw new InternalServerError(InternalServer)
        }
    } else {
        throw new InternalServerError(InternalServer)
    }
}