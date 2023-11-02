import express from "express"
import { deleteProduct, getAllInactivesProducts, getAllProducts, getAllProductsWithName, registerProduct, updateProduct } from "../controllers/productController"
import { authorizeGetAll, validateRoleUser, validateSchemaRequest, validateUser } from "../middlewares/auth.middleware"
import { ERole } from "../enums/ERole"
import { productMongoSchema, productRegistrationSchema } from "../schemas/productSchema"

const router = express.Router()

// MIDDLEWARE FOR VALIDATE IF USER IS AUTHENTICATED
router.use(validateUser())

// GET ALL PRODUCT
router.get("/", authorizeGetAll(Object.values(ERole)), getAllProducts)

// MIDDLEWARE FOR CHECK IF USER ROLE IS VALID
router.use(validateRoleUser([ERole.Admin, ERole.Biller]))

// GET PRODUCTS BY NAME
router.get("/name/:productName", getAllProductsWithName)
//GET ALL INACTIVE PRODUCTS
router.get("/inactives", getAllInactivesProducts)
// PRODUCT REGISTER
router.post("/register", validateSchemaRequest(productRegistrationSchema), registerProduct)
// PRODUCT UPDATE
router.put("/update", validateSchemaRequest(productMongoSchema), updateProduct)
//  PRODUCT DELETE
router.delete("/delete/:productId", deleteProduct)

export default router