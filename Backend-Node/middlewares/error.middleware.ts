import { NextFunction, Request, Response } from "express";
import { AuthenticationError, BadRequestError, ResourceNotFoundError, ResourceAlreadyRegisteredError } from "../errors/customErrorrs";
import { InternalServer } from "../errors/errorMessages";

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    switch (true) {
        case error instanceof AuthenticationError: 
            res.status(401).json({ok:false, message: error.message})
            break;
        case error instanceof ResourceNotFoundError: 
            res.status(404).json({ok:false, message: error.message})
            break;
        case error instanceof BadRequestError: 
            res.status(400).json({ok:false, message: error.message})
            break;
        case error instanceof ResourceAlreadyRegisteredError:
            res.status(409).json({ok:false, message: error.message})
            break;

        default:
            res.status(500).json({ok: false, message: InternalServer})
    }
}