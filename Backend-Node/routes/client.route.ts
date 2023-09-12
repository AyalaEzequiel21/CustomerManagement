import express from 'express'
import { createClient, getAllClients } from '../controllers/client.controller'

const router = express.Router()

// CLIENT REGISTER
router.post("/register", createClient)
// CLIENT UPDATE
router.put("/update")
// GET ALL CLIENTS
router.get("/", getAllClients )
// GET CLIENTS BY NAME
router.get("/:name")
// GET CLIENTS BY CATEGORY


export default router