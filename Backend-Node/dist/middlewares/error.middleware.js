"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const customErrors_1 = require("../errors/customErrors");
const errorHandler = (error, req, res, next) => {
    switch (true) {
        case error instanceof customErrors_1.AuthenticationError:
            res.status(401).json({ ok: false, message: error.message });
            break;
        case error instanceof customErrors_1.ResourceNotFoundError:
            res.status(404).json({ ok: false, message: error.message });
            break;
        case error instanceof customErrors_1.BadRequestError:
            res.status(400).json({ ok: false, message: error.message });
            break;
        case error instanceof customErrors_1.ResourceAlreadyRegisteredError:
            res.status(409).json({ ok: false, message: error.message });
            break;
        default:
            res.status(500).json({ ok: false, message: ` ${error.message}` });
    }
};
exports.errorHandler = errorHandler;
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
