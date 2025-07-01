import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from"../Middleware/multer.middleware.js"

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


export default router