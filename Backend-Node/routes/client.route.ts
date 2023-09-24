import express from 'express'
import { deleteClient, getAllClients, getAllClientsWithCategory, getAllClientsWithName, getAllInactiveClients, registerClient, updateClient } from '../controllers/client.controller'
import { authorizeGetAllClients, validateRoleUser, validateSchemaRequest, validateUser } from '../middlewares/auth.middleware'
import { ERole } from '../enums/ERole'
import { clientMongoSchema, clientRegistrationSchema } from '../schemas/clientSchemas'

const router = express.Router()

// MIDDLEWARE FOR VALIDATE IF USER IS AUTHENTICATED
router.use(validateUser())

// GET ALL CLIENTS
router.get("/", authorizeGetAllClients([ERole.Admin, ERole.Biller, ERole.Delivery]), getAllClients )

// MIDDLEWARE FOR CHECK IF USER ROLE IS VALID
router.use(validateRoleUser([ERole.Admin, ERole.Biller]))

// CLIENT REGISTER
router.post("/register", validateSchemaRequest(clientRegistrationSchema), registerClient)
// CLIENT UPDATE
router.put("/update", validateSchemaRequest(clientMongoSchema), updateClient)
// GET CLIENTS BY NAME
router.get("/:name", getAllClientsWithName)
// GET CLIENTS BY CATEGORY
router.get("/category/:category", getAllClientsWithCategory)
// GET ALL INACTIVE CLIENTS
router.get("/inactives", getAllInactiveClients)
// DELETE CLIENT BY ID 
router.delete("/delete/:clientId", deleteClient)


export default router