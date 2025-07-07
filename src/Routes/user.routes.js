import { Router } from "express";
import { logoutUser, registerUser , loginUser , refreshAccessToken } from "../controllers/user.controller.js";
import {upload} from"../Middleware/multer.middleware.js"
import { verifyJWT } from "../Middleware/auth.middleware.js";

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
router.route("/refresh").post(verifyJWT,refreshAccessToken)


export default router