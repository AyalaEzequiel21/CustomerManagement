import { Request, Response } from "express"

export const login = (req: Request, res: Response) => {
    const data = req.body
    console.log(data);
    
    res.send("LOGIN")
}

export const generateCode = (req: Request, res: Response) => {
    res.send("CODE GENERATED")
}