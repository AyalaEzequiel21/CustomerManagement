import express from 'express'
import { authorizeGetAll, validateRoleUser, validateSchemaRequest, validateUser } from '../middlewares/auth.middleware'
import { ERole } from '../enums/ERole'
import { paymentRegistrationSchema } from '../schemas/paymentSchema'
import { getAllPayments, getPaymentsOfClient, registerPayment, removePayment } from '../controllers/paymentController'

const router = express.Router()

// MIDDLEWARE FOR VALIDATE IF USER IS AUTHENTICATED
router.use(validateUser())

//  GET ALL PAYMENTS 
router.get("/", authorizeGetAll(Object.values(ERole)), getAllPayments)

// MIDDLEWARE FOR CHECK IF USER ROLE IS VALID
router.use(validateRoleUser([ERole.Admin, ERole.Biller]))

// PAYMENT REGISTER 
router.post("/register", validateSchemaRequest(paymentRegistrationSchema), registerPayment)
// GET PAYMENTS BY PAYMENT METHOD
router.get("/method/:paymentMethod")
// GET PAYMENTS BY PAYMENT DATE
router.get("/date/paymentDate")
// GET ALL PAYMENTS BY CLIENT ID    
router.get("/client/:clientId", getPaymentsOfClient)
// PAYMENT DELETE
router.delete("/delete/:paymentId", removePayment)

export default router

 