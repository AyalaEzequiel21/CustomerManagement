import express from "express"
import authRoutes from './auth.route'
import homeRoute from './home.route'

const router = express.Router()

router.use("/auth", authRoutes)
router.use("/home", homeRoute)

export default router

