"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const ERole_1 = require("../enums/ERole");
const reportSchema_1 = require("../schemas/reportSchema");
const reportController_1 = require("../controllers/reportController");
const router = express_1.default.Router();
// MIDDLEWARE FOR VALIDATE IF USER IS AUTHENTICATED
router.use((0, auth_middleware_1.validateUser)());
// REPORT REGISTER
router.post("/register", (0, auth_middleware_1.validateSchemaRequest)(reportSchema_1.reportRegistrationSchema), reportController_1.registerReport);
// GET ALL REPORTS
router.get("/", (0, auth_middleware_1.authorizeGetAll)(Object.values(ERole_1.ERole)), reportController_1.getAllReports);
// GET ALL VALIDATED REPORTS  
router.get("/allValidated", reportController_1.getAllValidatedReports);
// GET ALL PENDING REPORTS  
router.get("/allPending", reportController_1.getAllPendingReports);
//GET REPORT BY DATE
router.get("/report-date", reportController_1.getReportsByDate);
// MIDDLEWARE FOR CHECK IF USER ROLE IS VALID
router.use((0, auth_middleware_1.validateRoleUser)([ERole_1.ERole.Admin, ERole_1.ERole.Biller]));
// REPORT UPDATE
router.put("/update", (0, auth_middleware_1.validateSchemaRequest)(reportSchema_1.reportMongoSchema), reportController_1.updateReport);
// VALIDATE REPORT
router.put("/validate/:reportId", reportController_1.validateReport);
// DELETE REPORT
router.delete("/delete/:reportId", reportController_1.deleteReport);
exports.default = router;
