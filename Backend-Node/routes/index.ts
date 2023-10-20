import express from "express"
import authRoutes from './authRoute'
import clientRoutes from './clientRoute'
import productRoutes from './productRoute'
import paymentRoutes from './paymentRoute'
import reportRoutes from './reportRoute'
import saleRoutes from './saleRoute'

const router = express.Router()

router.use("/auth", authRoutes)
router.use("/clients", clientRoutes)
router.use("/products", productRoutes)
router.use("/payments", paymentRoutes)
router.use("/reports", reportRoutes)
router.use("/sales", saleRoutes)

export default router

