import { Router } from "express";
import { 
    createSession, 
    endSession, 
} from "../middlewares/authenticate.js"; 

import userController from "../controllers/user.controller.js"
import serviceErrorHandler from "../middlewares/serviceErrorHandler.js";
import expressAsyncHandler from "express-async-handler";

const userRouter = Router()

userRouter.post("/register", expressAsyncHandler(userController.createUser))

userRouter.post("/login", expressAsyncHandler(createSession))

userRouter.post("/logout", expressAsyncHandler(endSession))

userRouter.get("/user/:userId", expressAsyncHandler(userController.getUser))

/**
 * CURRENTLY NOT SUPPORTED
 */
// userRouter.get("/users", userController.getAllUsers)

userRouter.use(serviceErrorHandler); 

export default userRouter; 