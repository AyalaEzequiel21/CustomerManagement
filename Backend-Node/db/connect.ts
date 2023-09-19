import mongoose from 'mongoose'
import dotenv from 'dotenv'


// config dotenv
dotenv.config()

async function connectDB() {
    if(!process.env.MONGODB_URL){
        throw new Error("Falta la variable de entorno MONGODB_URL")
    }
    try {
        await mongoose.connect(process.env.MONGODB_URL)

        console.log("connection succesful");  
    } catch (error) {
        console.log("Error to connect Data Base, " + error);
    }
}

export default connectDB