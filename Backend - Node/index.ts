import express from "express"
import routes from './routes'
import connectDB from "./db/connect"
import dotenv from 'dotenv'

// initialize the app

const app = express()

// config dotenv
dotenv.config()

// connect to Data Base
connectDB()

app.use('/pradera', routes)

const PORT = process.env.PORT || 4000

app.listen(PORT, ()=> {
    console.log("App listening in port: ", PORT);
    
})