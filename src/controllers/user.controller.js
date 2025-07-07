import {asyncHandler} from "../utis/asyncHandler.js"
import {Apierror} from  "../utis/Apierror.js"
import {User} from  "../Models/user.model.js"
import {uploadOnCloudnary} from "../utis/fileUpload_Cloudnary.js"
import { ApiResponse } from "../utis/ApiResponse.js"
import jwt from "jsonwebtoken"
const generateAccessAndRefershToken=async(userId)=>{
    try {
        const user=await User.findById(userId);
        const accessToken =user.generateAccessToken();
        const refershToken = user.generateRefreshToken() ;
        user.refershToken=refershToken
        await user.save({validateBeforeSave: false})
        return {accessToken,refershToken}
        
    } catch (error) {
        throw new Apierror('400',"Something went wrong while generating token");
    }
} 
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


const loginUser= asyncHandler(async (req, res)=>{
     
    //req boy -> data

    // username or email
    // find 
    //password check 
    //access and generate refresh token 
    // send secure cookies 
   
    const {email,userName,password} =req.body;
       
    if(!(email || userName)){
        throw new Apierror('400' , "UserName or email is required")
    }
    const user = await User.findOne({
        $or :[{userName,email}]
    })
    if (!user) {
        throw new Apierror('404',"User does not exist");
    }
   const isPasswordvalid= await user.isPasswordCorrect(password)
   if(!isPasswordvalid){
    throw new Apierror('401', "Invalid user credentail")

   }
   const {accessToken ,refershToken}=await generateAccessAndRefershToken(user._id)

  const loginuser= await User.findById(user._id).select("-password -refershtoken");
  const options={
    httpOnly:true,
    secure:true
  }
    console.log(accessToken);
    console.log(refershToken);
    return  res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refershToken,options)
  .json(
    new ApiResponse(200,{
        user:loginuser,
        accessToken,
        refershToken
        },
        "User Logined successfully"
    )
  )


})



const logoutUser=asyncHandler(async (req,res)=>{
    //
    await User.findByIdAndUpdate(req.user._id,{
       $unset:{
        refershToken:1
       }
    },
    {new:true})
    const options={
    httpOnly:true,
    secure:true
  }
  return res.status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(
    new ApiResponse(200,{},"User logged out successfully")
  )
})

const refreshAccessToken=asyncHandler(async (req,res)=>{
    const incommingRefreshToken=  req.cookies.refershToken || req.body.refershToken
    if(!incommingRefreshToken){
        throw new Apierror(400,"Unauthorized request")

    }
   try {
     const decodedToken=jwt.verify(incommingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
 
     const user=await User.findById(decodedToken._id)
     if(!user){
         throw new Apierror(404,"User does not exist")
     }
     if(user?.refershToken !== incommingRefreshToken){
         throw new Apierror(401,"Refresh token is exprired ")
     }
     const options={
         httpOnly:true,
         secure:true
       }
     const {accessToken , newrefershToken}=  await generateAccessAndRefershToken(user._id)
       return res.status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",newrefershToken,options)
     .json(  
         new ApiResponse(200,{
             accessToken,
             newrefershToken
         },"Access token refreshed successfully")
     )
    } catch (error) {
       throw new Apierror(400,error?.message||"Invalid refresh token");
    
   }

    

})
export {registerUser , loginUser, logoutUser,refreshAccessToken} 