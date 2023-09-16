import express from "express";
import { getAllUsers, login, logout, register } from "../controllers/auth.controller";
import { validateRoleUser, validateUser } from "../middlewares/auth.middleware";
import { ERole } from "../enums/ERole";

const router = express.Router()

// USER LOGIN
router.post("/login", login)

// MIDDLEWARE FOR VALIDATE IF USER IS AUTHENTICATED
router.use(validateUser())

// USER LOGOUT
router.post("/logout", logout)

// USER REGISTER
router.post("/register", validateRoleUser([ERole.Admin]), register)
// GET ALL USERS
router.get("/users", validateRoleUser([ERole.Admin]), getAllUsers)

export default router