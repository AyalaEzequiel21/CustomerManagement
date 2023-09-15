import { Request, Response } from "express"
import ProductModel from "../models/product"

export const registerProduct = async (req: Request, res: Response) => {
    const {productName, price_cat_1, price_cat_2} = req.body    

    const test = await ProductModel.exists({productName: productName})
    if(test != null){
        res.status(400).json({ok: false, message: "The product name has benn registered"})
    }
    else{
        const newProduct = await ProductModel.create({productName: productName, price_cat_1: price_cat_1, price_cat_2: price_cat_2})
        res.status(201).json({ok: true, data: newProduct})
    }
}

export const getAllProducts = async (req: Request, res: Response) => {
    
}