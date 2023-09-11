import express from "express";
import { getAllUsers, login, register } from "../controllers/auth.controller";
import { validateUser } from "../middlewares/auth.middleware";

const router = express.Router()

router.use(validateUser())

// USER LOGIN
router.post("/login", login)
// USER REGISTER
router.post("/register", register)
// GET ALL USERS
router.get("/", getAllUsers)

export default router