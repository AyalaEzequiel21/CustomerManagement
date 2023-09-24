import { NextFunction, Request, Response } from "express"
import * as productService from '../services/productService'

/////////////////////////
// PRODUCT CONTROLLER
///////////////////////

export const registerProduct = async (req: Request, res: Response, next: NextFunction) => {
    const product = req.body // GET THE PRODUCT TO CREATE FROM THE REQUEST
    try {
        const newProduct = await productService.createProduct(product) // CREATE THE NEW PRODUCT
        res.status(201).json({ok: true, data: newProduct}) // RETURN STSTAUS 201 AND THE NEW PRODUCT    
    } catch(error){        
        next(error)
    }
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const product = req.body // GET THE PRODUCT TO UPDATE FROM THE REQUEST
    try {
        const productUpdated = await productService.updateProduct(product) // UPDATE THE PRODUCT WITH PRODUCTSERVICE
        res.status(200).json({ok: true, data: productUpdated}) // RETURN STATUS 200 AND THE PRODUCT UPDATED
    } catch (error){
        next(error)
    }
}

export const getAllProducts = async (req: any, res: Response, next: NextFunction) => {
    const inDelivery: boolean = req.filterDelivery // CHECK IF THE FILTER IN_DELIVERY IS ACTIVE
    try {
        const products = await productService.getAllProducts(inDelivery) // GET ALL PRODUCTS AND VALIDATE WHO REQUESTS IT
        res.status(200).json({ok: true, data: products}) // RETURN STATUS 200 AND THE DATA
    } catch(error){
        next(error)
    }
}

export const getAllInactivesProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const inactiveProducts = await productService.getInactiveProducts()
        res.status(200).json({ok: true, data: inactiveProducts})
    } catch (error){
        next(error)
    }
}

export const getAllProductsWithName = async (req: Request, res: Response, next: NextFunction) => {
    const productName = req.params.productName // GET THE NAME FROM THE PARAMS 
    try {
        const products = await productService.getProductsByName(productName) // GET ALL PRODUCTS THAT IN HIS NAME CONTAINS PRODUCTNAME
        res.status(200).json({ok: true, data: products}) // RETURN STATUS 200 AND THE PRODUCTS
    } catch (error){
        next(error)
    }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.productId // GET THE PRODUCT ID FROM THE PARAMS     
    try {
        await productService.deleteProductById(productId)
        res.status(204).json({ok: true})
    } catch(error){
        next(error)
    }
}