"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductById = exports.getProductsByName = exports.getInactiveProducts = exports.getAllProducts = exports.updateProduct = exports.createProduct = void 0;
const ProductDto_1 = require("../dto/ProductDto");
const customErrors_1 = require("../errors/customErrors");
const errorMessages_1 = require("../errors/errorMessages");
const errorsPitcher_1 = require("../errors/errorsPitcher");
const product_1 = __importDefault(require("../models/product"));
const existingChecker_1 = require("../utils/existingChecker");
/////////////////////////
// PRODUCT SERVICE
///////////////////////
const createProduct = (newProduct) => __awaiter(void 0, void 0, void 0, function* () {
    const { productName, price_cat_1, price_cat_2 } = newProduct;
    try {
        if (yield (0, existingChecker_1.existsEntity)(product_1.default, "productName", productName)) { // IF THE PRODUCTNAME HAS ALREADY REGISTERED RUN AN EXCEPTION
            throw new customErrors_1.ResourceAlreadyRegisteredError(errorMessages_1.ProductAlreadyRegistered);
        }
        const productCreated = yield product_1.default.create({
            productName: productName,
            price_cat_1: price_cat_1,
            price_cat_2: price_cat_2
        });
        if (!productCreated) {
            throw new customErrors_1.BadRequestError(errorMessages_1.BadRequest);
        }
        return productCreated; // RETURNS THE PRODUCT CREATED
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.createProduct = createProduct;
const updateProduct = (product) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productSaved = yield product_1.default.findById(product._id); // GET THE PRODUCT SAVED BY ID
        if (!productSaved) { // IF THE PRODUCT NOT EXISTS THEN RUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.ProductNotFound);
        }
        productSaved.productName = product.productName; // ELSE UPDATE THE PRODUCT
        productSaved.price_cat_1 = product.price_cat_1;
        productSaved.price_cat_2 = product.price_cat_2;
        productSaved.is_active = product.is_active;
        const productUpdated = yield productSaved.save(); // SAVE THE UPDATE AND RETURN 
        if (!productUpdated) { //IF CANNOT SAVE THE UPDATE RUN AN EXCEPTION
            throw new customErrors_1.BadRequestError(errorMessages_1.BadRequest);
        }
        return productUpdated;
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.updateProduct = updateProduct;
const getAllProducts = (inDelivery) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_1.default.find({ is_active: true }); // GET ALL ACTIVE PRODUCTS
        if ((0, existingChecker_1.isEmptyList)(products)) { // IF THE PRODUCTS IS EMPTY RUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.ProductNotFound);
        }
        if (inDelivery) { // IF IN DELIVERY IS TRUE RETURN A PRODUCTDTO FOR ANY PRODUCT
            return products.map(product => new ProductDto_1.ProductDto(product.productName, product.price_cat_2));
        }
        return products; // ELSE RETURNS ALL PRODUCTS
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.getAllProducts = getAllProducts;
const getInactiveProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inactivesProducts = yield product_1.default.find({ is_active: false }); // GET ALL INACTIVES PRODUCTS
        if ((0, existingChecker_1.isEmptyList)(inactivesProducts)) { // IF INACTIVE CLIENTS IS EMPTY RUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.ProductNotFound);
        }
        return inactivesProducts; // ELSE RETURNS INACTIVE CLIENTS
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.getInactiveProducts = getInactiveProducts;
const getProductsByName = (productName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productsFound = yield product_1.default.find({ productName: { $regex: productName, $options: 'i' } }); // GET ALL PRODUCTS WITH PRODUCTNAME IS EQUALS TO PARAM
        if ((0, existingChecker_1.isEmptyList)(productsFound)) { // IF PRODUCTSFOUND IS EMPTY RUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.ProductNotFound);
        }
        const productsFiltered = productsFound.filter(product => product.is_active); // FILTER ACTIVE PRODUCTS
        if ((0, existingChecker_1.isEmptyList)(productsFiltered)) {
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.ProductNotFound);
        }
        return productsFiltered; // RETURN PRODUCTS FILTERED
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.getProductsByName = getProductsByName;
const deleteProductById = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productSaved = yield product_1.default.findById(productId); // GET THE PRODUCT SAVED
        if (productSaved && productSaved.is_active) { // IF EXISTS THE PRODUCT THEN MODIFY HIS ATTRIBUTE IS_ACTIVE TO FALSE
            productSaved.is_active = false;
        }
        else {
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.ProductNotFound);
        }
        productSaved.save(); // SAVE THE PRODUCT INACTIVE NOW
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.deleteProductById = deleteProductById;
