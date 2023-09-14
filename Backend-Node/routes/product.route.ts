import express from "express"
import { registerProduct } from "../controllers/product.controller"

const router = express.Router()

// PRODUCT REGISTER
router.post("/register", registerProduct)
// PRODUCT UPDATE
router.put("/update")
// GET ALL PRODUCT
router.get("/" )
// GET PRODUCTS BY NAME
router.get("/:name")

export default router