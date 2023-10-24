import { ProductDto } from "../dto/ProductDto";
import { BadRequestError, ResourceAlreadyRegisteredError, ResourceNotFoundError } from "../errors/customErrors";
import { BadRequest, ProductAlreadyRegistered, ProductNotFound } from "../errors/errorMessages";
import { errorsPitcher } from "../errors/errorsPitcher";
import ProductModel from "../models/product";
import { ProductMongo, ProductRegister } from "../schemas/productSchema";
import { existsEntity, isEmptyList } from "../utils/existingChecker";

/////////////////////////
// PRODUCT SERVICE
///////////////////////


export const createProduct = async (newProduct: ProductRegister) => {
    const {productName, price_cat_1, price_cat_2} = newProduct 
    if(await existsEntity(ProductModel, "productName", productName)){ // IF THE PRODUCTNAME HAS ALREADY REGISTERED RUN AN EXCEPTION
        throw new ResourceAlreadyRegisteredError(ProductAlreadyRegistered)
    }
    try{
        const productCreated = await ProductModel.create({
            productName: productName,
            price_cat_1: price_cat_1,
            price_cat_2: price_cat_2
        })
        return productCreated // RETURNS THE PRODUCT CREATED
    } catch(error){
        throw new BadRequestError(BadRequest)
    }
}

export const updateProduct = async (product: ProductMongo) => {
    try{
        const productSaved = await ProductModel.findById(product._id) // GET THE PRODUCT SAVED BY ID
        if(productSaved){ // IF THE PRODUCT EXISTS THEN UPDATE
            productSaved.productName = product.productName
            productSaved.price_cat_1 = product.price_cat_1
            productSaved.price_cat_2 = product.price_cat_2
            productSaved.is_active = product.is_active
        } else {
            throw new ResourceNotFoundError(ProductNotFound) 
        }
        const productUpdated = await productSaved.save() // SAVE THE UPDATE AND RETURN 
        return productUpdated
    } catch (error){
        throw new BadRequestError(BadRequest)
    }
}

export const getAllProducts = async (inDelivery: boolean) => {
    try {
        const products = await ProductModel.find({is_active: true}) // GET ALL ACTIVE PRODUCTS
        if(isEmptyList(products)){ // IF THE PRODUCTS IS EMPTY RUN AN EXCEPTION
            throw new ResourceNotFoundError(ProductNotFound)
        }

        if(inDelivery){
            return products.map(product => new ProductDto(product.productName, product.price_cat_2))
        }
        return products
    } catch(error){
        errorsPitcher(error)
    }
}

export const getInactiveProducts = async () => {
    try {
        const inactivesProducts = await ProductModel.find({is_active: false}) // GET ALL INACTIVES PRODUCTS
        if(isEmptyList(inactivesProducts)){ // IF INACTIVE CLIENTS IS EMPTY RUN AN EXCEPTION
            throw new ResourceNotFoundError(ProductNotFound)
        }
        return inactivesProducts // ELSE RETURNS INACTIVE CLIENTS
    } catch (error){
        errorsPitcher(error)
    }
}

export const getProductsByName = async (productName: string) => {
    try {
        const productsFound = await ProductModel.find({productName: { $regex: productName, $options: 'i' }}) // GET ALL PRODUCTS WITH PRODUCTNAME IS EQUALS TO PARAM
        if(isEmptyList(productsFound)){ // IF PRODUCTSFOUND IS EMPTY RUN AN EXCEPTION
            throw new ResourceNotFoundError(ProductNotFound)
        }
        return productsFound.filter(product => product.is_active) // ELSE RETURN PRODUCTS FOUND
    } catch (error){
        errorsPitcher(error)
    }
}

export const deleteProductById = async (productId: string) => {    
    try {
        const productSaved = await ProductModel.findById(productId) // GET THE PRODUCT SAVED
        if(productSaved && productSaved.is_active){ // IF EXISTS THE PRODUCT THEN MODIFY HIS ATTRIBUTE IS_ACTIVE TO FALSE
            productSaved.is_active = false
        } else {
            throw new ResourceNotFoundError(ProductNotFound)
        }
        productSaved.save() // SAVE THE PRODUCT INACTIVE NOW
    } catch (error){
        errorsPitcher(error)
    }
}