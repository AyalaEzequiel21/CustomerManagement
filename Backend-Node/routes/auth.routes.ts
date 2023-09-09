import express from "express";
import { generateCode, login } from "../controllers/auth.controller";

const router = express.Router()

router.post("/login", login)
// router.post("/login/:email/code", generateCode)

export default router