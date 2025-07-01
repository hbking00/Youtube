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


//routes import
import userRouter from "./Routes/user.routes.js"
//routes decleration 
app.use("/api/v1/users",userRouter)   //https://localhost:8000/api/v1/users/register



export {app}