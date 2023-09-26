import { Router } from "express";
import customRunController from "../controllers/customRun.controller.js";
import customRunFilesUpload from "../middlewares/customRunFileUpload.js"; 
const customRunRouter = Router(); 

customRunRouter.post("/customRun", customRunFilesUpload, customRunController.customRun); 

export default customRunRouter; 