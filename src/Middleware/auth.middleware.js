import { Apierror } from "../utis/Apierror.js";
import { asyncHandler } from "../utis/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../Models/user.model.js";


export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        console.log(req.cookies);
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log(token);
        if (!token) {
            throw new Apierror(401, "Unauthorized request")
        } 
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refershToken")
    
        if (!user) {
            
            throw new Apierror(401, "Invalid Access Token")
        }
        req.user = user;
        next()
    } catch (error) {
        throw new Apierror(401, error?.message || "Invalid access token")
    }
    
})