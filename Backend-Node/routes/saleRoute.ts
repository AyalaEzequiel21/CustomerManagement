import express from 'express'
import { validateRoleUser, validateSchemaRequest, validateUser } from '../middlewares/auth.middleware'
import { authorizeGetAll } from '../middlewares/auth.middleware'
import { ERole } from '../enums/ERole'
import { deleteSale, getAllSales, registerSale, updateSale } from '../controllers/salesController'
import { saleMongoSchema, saleRegistrationSchema } from '../schemas/saleSchema'

const router = express.Router()

// MIDDLEWARE FOR VALIDATE IF USER IS AUTHENTICATED
router.use(validateUser())

// GET ALL SALES
router.get("/", authorizeGetAll(Object.values(ERole)), getAllSales)

// MIDDLEWARE FOR CHECK IF USER ROLE IS VALID
router.use(validateRoleUser([ERole.Admin, ERole.Biller]))

// SALE REGISTER 
router.post("/register", validateSchemaRequest(saleRegistrationSchema), registerSale)
// SALE UPDATE
router.put("/update", validateSchemaRequest(saleMongoSchema), updateSale)
// SALE DELETE
router.delete("/delete/:saleId", deleteSale)

export default router