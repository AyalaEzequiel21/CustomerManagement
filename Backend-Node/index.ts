import express from "express"
import routes from './routes'
import {connectDB} from "./db/connect"
// import cors from 'cors'
import cookieParser from 'cookie-parser'
import { errorHandler } from "./middlewares/error.middleware"

// initialize the app

const app = express()


app.use(cookieParser())
app.use(express.json())
// app.use(cors({origin: "*", credentials: true}))
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*'])
    res.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.append('Access-Control-Allow-Headers', 'Content-Type')
    next()
})
app.use('/praderaAPI', routes)
app.use(errorHandler)

// connect to Data Base
connectDB().then(() => {
    const PORT = process.env.PORT || 4000
    
    app.listen(PORT, ()=> {
        console.log("App listening in port: ", PORT);    
    })
})

