import express from 'express'
import { validateRoleUser, validateSchemaRequest, validateUser } from '../middlewares/auth.middleware'
import { authorizeGetAll } from '../middlewares/auth.middleware'
import { ERole } from '../enums/ERole'
import { deleteSale, getAllSales, getSalesByClientName, getSalesBySaleDate, registerSale, updateSale } from '../controllers/saleController'
import { saleMongoSchema, saleRegistrationSchema } from '../schemas/saleSchema'

const router = express.Router()

// MIDDLEWARE FOR VALIDATE IF USER IS AUTHENTICATED
router.use(validateUser())

// GET ALL SALES
router.get("/", authorizeGetAll(Object.values(ERole)), getAllSales)
// GET SALES BY NAME CLIENT
router.get("/client/:clientName", authorizeGetAll(Object.values(ERole)), getSalesByClientName)
// GET SALES BY DATE
router.get("/saleDate", authorizeGetAll(Object.values(ERole)), getSalesBySaleDate)

// MIDDLEWARE FOR CHECK IF USER ROLE IS VALID
router.use(validateRoleUser([ERole.Admin, ERole.Biller]))

// SALE REGISTER 
router.post("/register", validateSchemaRequest(saleRegistrationSchema), registerSale)
// SALE UPDATE
router.put("/update", validateSchemaRequest(saleMongoSchema), updateSale)
// SALE DELETE
router.delete("/delete/:saleId", deleteSale)

export default router