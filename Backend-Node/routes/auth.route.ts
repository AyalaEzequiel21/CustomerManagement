import express from "express";
import { getAllUsers, login, register } from "../controllers/auth.controller";
import { validateUser } from "../middlewares/auth.middleware";
import { ERole } from "../enums/ERole";

const router = express.Router()

// USER LOGIN
router.post("/login", login)

router.use(validateUser([ERole.Admin]))

// USER REGISTER
router.post("/register", register)
// GET ALL USERS
router.get("/users", getAllUsers)

export default router