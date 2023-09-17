import express from "express";
import { deleteUser, getAllUsers, login, logout, registerUser, updateUser } from "../controllers/auth.controller";
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
router.post("/user/register", validateRoleUser([ERole.Admin]), registerUser)
// USER UPDATE
router.put("/user/update", validateRoleUser([ERole.Admin]), updateUser)
// GET ALL USERS
router.get("/users", validateRoleUser([ERole.Admin]), getAllUsers)
// USER DELETE 
router.delete("/user/delete/:id", validateRoleUser([ERole.Admin]), deleteUser)

export default router