import express from 'express'
import { authorizeGetAll, validateRoleUser, validateSchemaRequest, validateUser } from '../middlewares/auth.middleware'
import { ERole } from '../enums/ERole'
import { reportMongoSchema, reportRegistrationSchema } from '../schemas/reportSchema'
import { getAllReports, registerReport, updateReport, validateReport } from '../controllers/reportController'

const router = express.Router()

// MIDDLEWARE FOR VALIDATE IF USER IS AUTHENTICATED
router.use(validateUser()) 

// REPORT REGISTER
router.post("/register", validateSchemaRequest(reportRegistrationSchema), registerReport)
// GET ALL REPORTS
router.get("/", authorizeGetAll(Object.values(ERole)), getAllReports)

// MIDDLEWARE FOR CHECK IF USER ROLE IS VALID
router.use(validateRoleUser([ERole.Admin, ERole.Biller]))

// REPORT UPDATE
router.put("/update", validateSchemaRequest(reportMongoSchema), updateReport)
// VALIDATE REPORT
router.put("/validate/:reportId", validateReport)

export default router