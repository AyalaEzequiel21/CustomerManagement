import express from "express"
import authRoutes from './auth.route'
import clientRoutes from './client.route'
import productRoutes from './product.route'

const router = express.Router()

router.use("/auth", authRoutes)
router.use("/clients", clientRoutes)
router.use("/products", productRoutes)

export default router

