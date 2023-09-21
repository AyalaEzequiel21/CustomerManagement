import express from 'express'
import { getAllClients } from '../controllers/client.controller'
import { authorizeGetAllClients, validateRoleUser, validateSchemaRequest, validateUser } from '../middlewares/auth.middleware'
import { ERole } from '../enums/ERole'
import { clientMongoSchema, clientRegistrationSchema } from '../schemas/clientSchemas'

const router = express.Router()

// MIDDLEWARE FOR VALIDATE IF USER IS AUTHENTICATED
router.use(validateUser())

// GET ALL CLIENTS
router.get("/", authorizeGetAllClients([ERole.Admin, ERole.Biller]), getAllClients )

// MIDDLEWARE FOR CHECK IF USER ROLE IS VALID
router.use(validateRoleUser([ERole.Admin, ERole.Biller]))

// CLIENT REGISTER
router.post("/register", validateSchemaRequest(clientRegistrationSchema))
// CLIENT UPDATE
router.put("/update", validateSchemaRequest(clientMongoSchema))
// GET CLIENTS BY NAME
router.get("/:name")
// GET CLIENTS BY CATEGORY
router.get("/category/:category", )


export default router