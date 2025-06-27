import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"20kb"}))  //// Built-in middleware to parse JSON request body with 20kb maximum size
app.use(express.urlencoded({extended:true , limit:"16kb"}))   //url
app.use(express.static("public"))   //// Serve static files from 'public' folder
app.use(cookieParser())
export {app}