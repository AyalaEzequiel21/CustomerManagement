import express from "express"
import routes from './routes'
import {connectDB} from "./db/connect"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { errorHandler } from "./middlewares/error.middleware"

// initialize the app

const app = express()


app.use(cookieParser())
app.use(express.json())
app.use(cors({origin: "http://localhost:3000", credentials: true}))
app.use('/praderaAPI', routes)
app.use(errorHandler)

// connect to Data Base
connectDB().then(() => {
    const PORT = process.env.PORT || 4000
    
    app.listen(PORT, ()=> {
        console.log("App listening in port: ", PORT);    
    })
})

