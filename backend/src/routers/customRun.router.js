import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import customRunController from "../controllers/customRun.controller.js";
import customRunFilesUpload from "../middlewares/customRunFileUpload.js"; 

import serviceErrorHandler from "../middlewares/serviceErrorHandler.js";

const customRunRouter = Router(); 

customRunRouter.post("/customRun", customRunFilesUpload, expressAsyncHandler(customRunController.customRun)); 

customRunRouter.use(serviceErrorHandler); 

export default customRunRouter; 