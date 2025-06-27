import dotenv from "dotenv" 
import connectDB from "./Database/index.js";
dotenv.config({
    path: './.env'
})
connectDB()