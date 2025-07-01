import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"  //filehandling in node js (file system)
 cloudinary.config({ 
        cloud_name: process.env.CLOUDNARY_CLOUD_NAME, 
        api_key:process.env.CLOUDNARY_API_KEY, 
        api_secret:process.env.CLOUDNARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    }
)
const uploadOnCloudnary= async (localfile)=>{
    try {
        if(!localfile){
            return null
        }
        //upload
        const res=await cloudinary.uploader.upload(localfile,{
            resource_type:"auto"
        })
        //file uploaded
        console.log("File uploaded success ",res.url);
        fs.unlinkSync(localfile)  // remove locally saved files 
        return res;
        
    } catch (error) {
         fs.unlinkSync(localfile)  // remove locally saved files 
        console.log("File NOT success ",error);
        
        return null
    }
}

export {uploadOnCloudnary};

