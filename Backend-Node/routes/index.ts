import express from "express"
import authRoutes from './authRoute'
import clientRoutes from './clientRoute'
import productRoutes from './productRoute'
import paymentRoutes from './paymentRoute'

const router = express.Router()

router.use("/auth", authRoutes)
router.use("/clients", clientRoutes)
router.use("/products", productRoutes)
router.use("/payments", paymentRoutes)

export default router

