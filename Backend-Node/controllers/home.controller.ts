import { Request, Response } from "express";

export const getHome = (req: Request, res: Response) => {
    console.log("home");
    res.status(200).json({ok: true, message: "datos del home"})
    
}