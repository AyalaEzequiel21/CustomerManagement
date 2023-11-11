"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clientController_1 = require("../controllers/clientController");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const ERole_1 = require("../enums/ERole");
const clientSchemas_1 = require("../schemas/clientSchemas");
const router = express_1.default.Router();
// MIDDLEWARE FOR VALIDATE IF USER IS AUTHENTICATED
router.use((0, auth_middleware_1.validateUser)());
// GET ALL CLIENTS
router.get("/", (0, auth_middleware_1.authorizeGetAll)(Object.values(ERole_1.ERole)), clientController_1.getAllClients);
// MIDDLEWARE FOR CHECK IF USER ROLE IS VALID
router.use((0, auth_middleware_1.validateRoleUser)([ERole_1.ERole.Admin, ERole_1.ERole.Biller]));
// CLIENT REGISTER
router.post("/register", (0, auth_middleware_1.validateSchemaRequest)(clientSchemas_1.clientRegistrationSchema), clientController_1.registerClient);
// CLIENT UPDATE
router.put("/update", (0, auth_middleware_1.validateSchemaRequest)(clientSchemas_1.clientMongoSchema), clientController_1.updateClient);
// GET CLIENTS BY NAME
router.get("/clientName/:name", clientController_1.getAllClientsWithName);
// GET CLIENTS BY CATEGORY
router.get("/category/:category", clientController_1.getAllClientsWithCategory);
// GET ALL INACTIVE CLIENTS
router.get("/inactives", clientController_1.getAllInactiveClients);
// DELETE CLIENT BY ID 
router.delete("/delete/:clientId", clientController_1.deleteClient);
exports.default = router;
