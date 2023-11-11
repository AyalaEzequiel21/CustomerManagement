"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const orderListSchema_1 = require("../schemas/orderListSchema");
const ERole_1 = require("../enums/ERole");
const orderListController_1 = require("../controllers/orderListController");
const router = express_1.default.Router();
// MIDDLEWARE FOR VALIDATE IF USER IS AUTHENTICATED
router.use((0, auth_middleware_1.validateUser)());
// GET ALL ORDERS
router.get("/", (0, auth_middleware_1.authorizeGetAll)(Object.values(ERole_1.ERole)), orderListController_1.getAllOrders);
// GET ALL COMPLETED ORDERS
router.get("/allCompleted", orderListController_1.getAllCompletedOrders);
// GET ALL PENDING ORDERS
router.get("/allPending", orderListController_1.getAllPendingOrders);
//GET ORDERS BY DATE
router.get("/order-date", orderListController_1.getOrdersByDate);
// MIDDLEWARE FOR CHECK IF USER ROLE IS VALID
router.use((0, auth_middleware_1.validateRoleUser)([ERole_1.ERole.Admin, ERole_1.ERole.Biller]));
// ORDER LIST REGISTER
router.post("/register", (0, auth_middleware_1.validateSchemaRequest)(orderListSchema_1.orderListRegistrationSchema), orderListController_1.registerOrderList);
// ORDER UPDATE
router.put("/update", orderListController_1.updateOrderList);
// DELETE ORDER
router.delete("/delete/:orderId", orderListController_1.deleteOrderById);
exports.default = router;
