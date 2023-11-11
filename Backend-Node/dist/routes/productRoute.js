"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const ERole_1 = require("../enums/ERole");
const productSchema_1 = require("../schemas/productSchema");
const router = express_1.default.Router();
// MIDDLEWARE FOR VALIDATE IF USER IS AUTHENTICATED
router.use((0, auth_middleware_1.validateUser)());
// GET ALL PRODUCT
router.get("/", (0, auth_middleware_1.authorizeGetAll)(Object.values(ERole_1.ERole)), productController_1.getAllProducts);
// MIDDLEWARE FOR CHECK IF USER ROLE IS VALID
router.use((0, auth_middleware_1.validateRoleUser)([ERole_1.ERole.Admin, ERole_1.ERole.Biller]));
// GET PRODUCTS BY NAME
router.get("/name/:productName", productController_1.getAllProductsWithName);
//GET ALL INACTIVE PRODUCTS
router.get("/inactives", productController_1.getAllInactivesProducts);
// PRODUCT REGISTER
router.post("/register", (0, auth_middleware_1.validateSchemaRequest)(productSchema_1.productRegistrationSchema), productController_1.registerProduct);
// PRODUCT UPDATE
router.put("/update", (0, auth_middleware_1.validateSchemaRequest)(productSchema_1.productMongoSchema), productController_1.updateProduct);
//  PRODUCT DELETE
router.delete("/delete/:productId", productController_1.deleteProduct);
exports.default = router;
