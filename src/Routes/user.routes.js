import { Router } from "express";
import { logoutUser, registerUser , loginUser , refreshAccessToken , changeCurrentPassword ,getCurrentUser,updateAccountDetails, updateUserAvtar, updateUsercoverImage, getUserChannelProfile, getWatchHistory} from "../controllers/user.controller.js";
import {upload} from"../Middleware/multer.middleware.js"
import { verifyJWT } from "../Middleware/auth.middleware.js";
import multer from "multer";

const router =Router();
router.route("/register").post(
    upload.fields([                              //Middleware for convering image to url 
        {
            name:"avtar",
            maxCount:1
        },{
            name:"coverImage",
            maxCount:1
        }

    ]),
    registerUser
)
//secure routes
router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(verifyJWT,refreshAccessToken)

router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateAccountDetails)
router.route("/avtar").patch(verifyJWT,upload.single("avtar"), updateUserAvtar)
router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"), updateUsercoverImage)
router.route("/c/:username").get(verifyJWT,getUserChannelProfile)
router.route("/watch-history").get(verifyJWT,getWatchHistory)




export default router