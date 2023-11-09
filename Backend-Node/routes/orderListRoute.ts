import express from 'express'
import { authorizeGetAll, validateRoleUser, validateSchemaRequest, validateUser } from '../middlewares/auth.middleware'
import { orderListRegistrationSchema } from '../schemas/orderListSchema'
import { ERole } from '../enums/ERole'
import { deleteOrderById, getAllCompletedOrders, getAllOrders, getAllPendingOrders, getOrdersByDate, registerOrderList, updateOrderList } from '../controllers/orderListController'

const router = express.Router()

// MIDDLEWARE FOR VALIDATE IF USER IS AUTHENTICATED
router.use(validateUser()) 

// GET ALL ORDERS
router.get("/", authorizeGetAll(Object.values(ERole)), getAllOrders)
// GET ALL COMPLETED ORDERS
router.get("/allCompleted", getAllCompletedOrders)
// GET ALL PENDING ORDERS
router.get("/allPending", getAllPendingOrders)
//GET ORDERS BY DATE
router.get("/order-date", getOrdersByDate)

// MIDDLEWARE FOR CHECK IF USER ROLE IS VALID
router.use(validateRoleUser([ERole.Admin, ERole.Biller]))

// ORDER LIST REGISTER
router.post("/register", validateSchemaRequest(orderListRegistrationSchema), registerOrderList)
// ORDER UPDATE
router.put("/update", updateOrderList)
// DELETE ORDER
router.delete("/delete/:orderId", deleteOrderById)


export default router