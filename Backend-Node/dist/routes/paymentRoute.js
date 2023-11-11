"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const ERole_1 = require("../enums/ERole");
const paymentSchema_1 = require("../schemas/paymentSchema");
const paymentController_1 = require("../controllers/paymentController");
const router = express_1.default.Router();
// MIDDLEWARE FOR VALIDATE IF USER IS AUTHENTICATED
router.use((0, auth_middleware_1.validateUser)());
//  GET ALL PAYMENTS 
router.get("/", (0, auth_middleware_1.authorizeGetAll)(Object.values(ERole_1.ERole)), paymentController_1.getAllPayments);
// MIDDLEWARE FOR CHECK IF USER ROLE IS VALID
router.use((0, auth_middleware_1.validateRoleUser)([ERole_1.ERole.Admin, ERole_1.ERole.Biller]));
// PAYMENT REGISTER 
router.post("/register", (0, auth_middleware_1.validateSchemaRequest)(paymentSchema_1.paymentRegistrationSchema), paymentController_1.registerPayment);
// GET PAYMENTS BY PAYMENT METHOD
router.get("/method/:paymentMethod", paymentController_1.getPaymentsOfPaymentMethod);
// GET PAYMENTS BY PAYMENT DATE
router.get("/payment-date", paymentController_1.getPaymentsOfPaymentDate);
// GET ALL PAYMENTS BY CLIENT ID    
router.get("/client/:clientId", paymentController_1.getPaymentsOfClient);
// PAYMENT DELETE
router.delete("/delete/:paymentId", paymentController_1.removePayment);
exports.default = router;
