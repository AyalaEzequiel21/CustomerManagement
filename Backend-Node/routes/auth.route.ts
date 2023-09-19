import express from "express";
import { deleteUser, getAllUsers, login, logout, registerUser, updateUser } from "../controllers/auth.controller";
import { validateRoleUser, validateSchemaRequest, validateUser } from "../middlewares/auth.middleware";
import { ERole } from "../enums/ERole";
import { loginDataSchema, userMongoSchema, userRegistrationSchema } from "../schemas/authSchemas";
 
const router = express.Router()

// USER LOGIN
router.post("/login", validateSchemaRequest(loginDataSchema), login)
// USER LOGOUT
router.post("/logout", logout)

// MIDDLEWARE FOR VALIDATE IF USER IS AUTHENTICATED
router.use(validateUser())

// MIDDLEWARE FOR CHECK IF USER ROLE IS VALID
router.use(validateRoleUser([ERole.Admin]))

// USER REGISTER
router.post("/user/register", validateSchemaRequest(userRegistrationSchema), registerUser)
// USER UPDATE
router.put("/user/update", validateSchemaRequest(userMongoSchema), updateUser)
// GET ALL USERS
router.get("/users", getAllUsers)
// USER DELETE 
router.delete("/user/delete/:id", deleteUser)


export default router