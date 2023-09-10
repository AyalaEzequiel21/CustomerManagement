import express from "express"
import { getHome } from "../controllers/home.controller"
import { validateUser } from "../middlewares/auth.middleware"

const router = express.Router()
router.use(validateUser())
router.get("/", getHome)

export default router
