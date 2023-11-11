"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const ERole_1 = require("../enums/ERole");
const authSchemas_1 = require("../schemas/authSchemas");
const router = express_1.default.Router();
// USER LOGIN
router.post("/login", (0, auth_middleware_1.validateSchemaRequest)(authSchemas_1.loginDataSchema), authController_1.login);
// USER LOGOUT
router.post("/logout", authController_1.logout);
// MIDDLEWARE FOR VALIDATE IF USER IS AUTHENTICATED
router.use((0, auth_middleware_1.validateUser)());
// MIDDLEWARE FOR CHECK IF USER ROLE IS VALID
router.use((0, auth_middleware_1.validateRoleUser)([ERole_1.ERole.Admin]));
// USER REGISTER
router.post("/user/register", (0, auth_middleware_1.validateSchemaRequest)(authSchemas_1.userRegistrationSchema), authController_1.registerUser);
// USER UPDATE
router.put("/user/update", (0, auth_middleware_1.validateSchemaRequest)(authSchemas_1.userMongoSchema), authController_1.updateUser);
// GET ALL USERS
router.get("/users", authController_1.getAllUsers);
// USER DELETE 
router.delete("/user/delete/:userId", authController_1.deleteUser);
exports.default = router;
