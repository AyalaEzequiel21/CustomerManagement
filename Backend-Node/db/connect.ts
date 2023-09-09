import mongoose from 'mongoose'
import dotenv from 'dotenv'
import UserModel from '../models/user'
import bcrypt from 'bcrypt'


// config dotenv
dotenv.config()

async function connectDB() {
    if(!process.env.MONGODB_URL){
        throw new Error("Falta la variable de entorno MONGODB_URL")
    }
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        // const newUser = new UserModel({
        // username:"beybi",
        // email: "beybi@mail.com",
        // password: await bcrypt.hash("daleboca", 8),
        // roles:{
        //     admin: true,
        //     biller: false,
        //     delivery: false
        // }
        // })
        console.log("connection succesful");
        // newUser.save()
        // console.log(newUser);
        
        
    } catch (error) {
        console.log("Error to connect Data Base, " + error);
    }
}

export default connectDB