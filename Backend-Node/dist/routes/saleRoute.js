"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const auth_middleware_2 = require("../middlewares/auth.middleware");
const ERole_1 = require("../enums/ERole");
const saleController_1 = require("../controllers/saleController");
const saleSchema_1 = require("../schemas/saleSchema");
const router = express_1.default.Router();
// MIDDLEWARE FOR VALIDATE IF USER IS AUTHENTICATED
router.use((0, auth_middleware_1.validateUser)());
// GET ALL SALES
router.get("/", (0, auth_middleware_2.authorizeGetAll)(Object.values(ERole_1.ERole)), saleController_1.getAllSales);
// GET SALES BY NAME CLIENT
router.get("/client/:clientName", (0, auth_middleware_2.authorizeGetAll)(Object.values(ERole_1.ERole)), saleController_1.getSalesByClientName);
// GET SALES BY DATE
router.get("/saleDate", (0, auth_middleware_2.authorizeGetAll)(Object.values(ERole_1.ERole)), saleController_1.getSalesBySaleDate);
// MIDDLEWARE FOR CHECK IF USER ROLE IS VALID
router.use((0, auth_middleware_1.validateRoleUser)([ERole_1.ERole.Admin, ERole_1.ERole.Biller]));
// SALE REGISTER 
router.post("/register", (0, auth_middleware_1.validateSchemaRequest)(saleSchema_1.saleRegistrationSchema), saleController_1.registerSale);
// SALE UPDATE
router.put("/update", (0, auth_middleware_1.validateSchemaRequest)(saleSchema_1.saleMongoSchema), saleController_1.updateSale);
// SALE DELETE
router.delete("/delete/:saleId", saleController_1.deleteSale);
exports.default = router;
