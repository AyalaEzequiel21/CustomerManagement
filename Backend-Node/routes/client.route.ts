import express from 'express'

const router = express.Router()

// CLIENT REGISTER
router.post("/register")
// CLIENT UPDATE
router.put("/update")
// GET ALL CLIENTS
router.get("/")
// GET CLIENTS BY NAME
router.get("/:name")
// GET CLIENTS BY CATEGORY


export default router