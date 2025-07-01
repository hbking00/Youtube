import {mongoose,Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import dotenv from "dotenv" 
dotenv.config({
    path: './.env'
})
 
const userSchema=new Schema(
    {
        userName :{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
             type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullname:{
             type:String,
            required:true,
            
            trim:true,
            index:true
        },
        avtar:{
             type:String,//cloudnary
             required : true,
        },
        coverImage:{
            type:String
        },
        watchhistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            type:String,
            required:[true,"Password is required"]
        },
        refershtoken:{
            type:String
        }
        
},{
    timestamps:true
})


userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next()
     this.password=await bcrypt.hash(this.password,10)
    next()
    
})
//bycrypt
userSchema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.password);
}
//token and generation
userSchema.methods.generateAccessToken=async function () {
     return  jwt.sign( 
        {
            _id:this._id,
            email:this.email,
            userName:this.userName,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:ACCESS_TOKEN_EXPIRY
        }
    )
}
// token and jwt
userSchema.methods.generateRefreshToken=async function () {
     return  jwt.sign( 
        {
            _id:this._id,
           
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:REFRESH_TOKEN_EXPIRY
        }
    )
    
}

export const User=mongoose.model("User",userSchema); 

