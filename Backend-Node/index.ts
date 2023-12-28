import express from "express"
import routes from './routes'
import {connectDB} from "./db/connect"
// import cors from 'cors'
import cookieParser from 'cookie-parser'
import { errorHandler } from "./middlewares/error.middleware"

// initialize the app

const cors = require('cors')
const app = express()

// const urlList = ['http://localhost:5173']

app.use(cookieParser())
app.use(express.json())
app.disable('x-powered-by')
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));
// app.use(cors(
//     {
//     origin: (origin, callback)=> {
//         if(!origin || urlList.includes(origin)){
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by Cors'))
//         }
//     }, 
//     credentials: true
// }
// ))
app.options('*', cors());
app.use(errorHandler)
app.use('/praderaAPI', routes)

// connect to Data Base
connectDB().then(() => {
    const PORT = process.env.PORT || 4000
    
    app.listen(PORT, ()=> {
        console.log("App listening in port: ", PORT);    
    })
})

