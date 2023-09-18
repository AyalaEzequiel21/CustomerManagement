import { NextFunction, Request, Response } from "express";
import { AuthenticationError, BadRequestError, ResourceNotFoundError, ResourceAlreadyRegisteredError } from "../errors/customErrors";
import { InternalServer } from "../errors/errorMessages";

export const errorHandler = (error: Error, res: Response) => {
        // console.error("Error occurred:", error); // Agrega esta línea para depurar
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

// export const errorHandler = (error: Error,  res: Response) => {
    
//     // console.error("Error occurred:", error); // Agrega esta línea para depurar
//     switch (true) {
//         case error instanceof AuthenticationError: 
//             res.status(401).json({ok:false, message: error.message})
//             break;
//         case error instanceof ResourceNotFoundError: 
//             res.status(404).json({ok:false, message: error.message})
//             break;
//         case error instanceof BadRequestError: 
//             res.status(400).json({ok:false, message: error.message})
//             break;
//         case error instanceof ResourceAlreadyRegisteredError:
//             res.status(409).json({ok:false, message: error.message})
//             break;

//         default:
//             res.status(500).json({ok: false, message: InternalServer})
//     }
// }