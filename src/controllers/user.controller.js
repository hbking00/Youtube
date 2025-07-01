import {asyncHandler} from "../utis/asyncHandler.js"

const registerUser= asyncHandler(async (req , res)=>{
    //get user details from frontend
    //validation - not empty and many more
    // check if it is allready exist : usname and email
    // check image , check avtar
    //upload them to cloudnary , avatar
    //create a object - create entry in db
    //remove pass and refresh token from response
    //check for user creation 
    //return res

    const {fullname , email , userName , password}=req.body
    console.log("email",email);    
})



export {registerUser} 