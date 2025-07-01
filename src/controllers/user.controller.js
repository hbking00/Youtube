import {asyncHandler} from "../utis/asyncHandler.js"
import {Apierror} from  "../utis/Apierror.js"
import {User} from  "../Models/user.model.js"
import {uploadOnCloudnary} from "../utis/fileUpload_Cloudnary.js"
import { ApiResponse } from "../utis/ApiResponse.js"
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
        console.log(userName);
        console.log("email",email);     
        console.log("fullName:",fullname);
        console.log("password",password);
    /*
    Normal method to check wheather the field is empty or not
    if(fullname ===""){
        throw new Apierror(400,"Full Name is required");
        
    }

    */
   if([fullname , email , userName , password].some((field)=>{
    return  field?.trim()==="" 
   }))
   {
    throw new Apierror(400,"All field are required")
    }
    const existingUser=await User.findOne({

        $or: [{email},{userName}]
    })

    if(existingUser){
        throw new Apierror(409 , "userName allready exist")
    }

   const avatarLocalPath= req.files?.avtar[0]?.path;
 //  const coverImageLocalPath=req.files?.coverImage[0].path ; this syntax might no work when it is optional to send image 

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath=req.files.coverImage[0].path
    }
   
   if(!avatarLocalPath){
    throw new Apierror(400,"Avatar file is required");
   }
    const avatar=await uploadOnCloudnary(avatarLocalPath);
    const coverImage=await uploadOnCloudnary(coverImageLocalPath);
    if (!avatar) {
        throw new Apierror(400,"Avatar missing in cloudnary");
        
    }

    const user=await User.create({
        fullname,
        avtar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        userName:userName.toLowerCase()

    })
    const createUser=await User.findById(user._id).select(
        "-password -refershtoken"
    )
    if(!createUser){
        throw new Apierror(500,"Something went wrong while registering ")
    }
    return res.status (201).json(
        new ApiResponse(200,createUser,"Created suceess")
    )
   // controllers/userController.js
    /*
    console.log("controller updated");
    res.json({ msg: "New version of getUser" })
    */



})



export {registerUser} 