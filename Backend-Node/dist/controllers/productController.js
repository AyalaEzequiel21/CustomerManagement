"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.getAllProductsWithName = exports.getAllInactivesProducts = exports.getAllProducts = exports.updateProduct = exports.registerProduct = void 0;
const productService = __importStar(require("../services/productService"));
/////////////////////////
// PRODUCT CONTROLLER
///////////////////////
const registerProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const product = req.body; // GET THE PRODUCT TO CREATE FROM THE REQUEST
    try {
        const newProduct = yield productService.createProduct(product); // CREATE THE NEW PRODUCT
        res.status(201).json({ ok: true, data: newProduct }); // RETURN STSTAUS 201 AND THE NEW PRODUCT    
    }
    catch (error) {
        next(error);
    }
});
exports.registerProduct = registerProduct;
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const product = req.body; // GET THE PRODUCT TO UPDATE FROM THE REQUEST
    try {
        const productUpdated = yield productService.updateProduct(product); // UPDATE THE PRODUCT WITH PRODUCTSERVICE
        res.status(200).json({ ok: true, data: productUpdated }); // RETURN STATUS 200 AND THE PRODUCT UPDATED
    }
    catch (error) {
        next(error);
    }
});
exports.updateProduct = updateProduct;
const getAllProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const inDelivery = req.filterDelivery; // CHECK IF THE FILTER IN_DELIVERY IS ACTIVE
    try {
        const products = yield productService.getAllProducts(inDelivery); // GET ALL PRODUCTS AND VALIDATE WHO REQUESTS IT
        res.status(200).json({ ok: true, data: products }); // RETURN STATUS 200 AND THE DATA
    }
    catch (error) {
        next(error);
    }
});
exports.getAllProducts = getAllProducts;
const getAllInactivesProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inactiveProducts = yield productService.getInactiveProducts();
        res.status(200).json({ ok: true, data: inactiveProducts });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllInactivesProducts = getAllInactivesProducts;
const getAllProductsWithName = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productName = req.params.productName; // GET THE NAME FROM THE PARAMS 
    try {
        const products = yield productService.getProductsByName(productName); // GET ALL PRODUCTS THAT IN HIS NAME CONTAINS PRODUCTNAME
        res.status(200).json({ ok: true, data: products }); // RETURN STATUS 200 AND THE PRODUCTS
    }
    catch (error) {
        next(error);
    }
});
exports.getAllProductsWithName = getAllProductsWithName;
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId; // GET THE PRODUCT ID FROM THE PARAMS     
    try {
        yield productService.deleteProductById(productId);
        res.status(204).json({ ok: true });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteProduct = deleteProduct;
