import express from "express"
import routes from './routes'
import connectDB from "./db/connect"
import cors from 'cors'

// initialize the app

const app = express()

// connect to Data Base
connectDB()

app.use(express.json())
app.use(cors({origin: "http://localhost:3000"}))
app.use('/praderaAPI', routes)

const PORT = process.env.PORT || 4000

app.listen(PORT, ()=> {
    console.log("App listening in port: ", PORT);
    
})