import express from 'express'
import { authorizeGetAll, validateRoleUser, validateSchemaRequest, validateUser } from '../middlewares/auth.middleware'
import { ERole } from '../enums/ERole'
import { paymentMongoSchema, paymentRegistrationSchema } from '../schemas/paymentSchema'

const router = express.Router()

// MIDDLEWARE FOR VALIDATE IF USER IS AUTHENTICATED
router.use(validateUser())

//  GET ALL PAYMENTS 
router.get("/", authorizeGetAll(Object.values(ERole)))

// MIDDLEWARE FOR CHECK IF USER ROLE IS VALID
router.use(validateRoleUser([ERole.Admin, ERole.Biller]))

// PAYMENT REGISTER 
router.post("/register", validateSchemaRequest(paymentRegistrationSchema))

// PAYMENT UPDATE 
router.put("/update", validateSchemaRequest(paymentMongoSchema))

// GET PAYMENTS BY PAYMENT METHOD
router.get("method/:method")

// GET PAYMENTS BY PAYMENT DATE
router.get("/date/paymentDate")

// PAYMENT DELETE
router.delete("/delete/:paymentId")

export default router

