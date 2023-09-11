import express from "express"
import authRoutes from './auth.route'
import clientRoutes from './client.route'

const router = express.Router()

router.use("/auth", authRoutes)
router.use("/clients", clientRoutes)

export default router

