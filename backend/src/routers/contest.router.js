import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import contestController from "../controllers/contest.controller.js"
import userCodeUpload from "../middlewares/userCodeUpload.js";
import serviceErrorHandler from "../middlewares/serviceErrorHandler.js";

const contestRouter = Router(); 

contestRouter.get("/contests", expressAsyncHandler(contestController.getAllContests));  

contestRouter.post("/contests/create", expressAsyncHandler(contestController.createContest)); 

// contestRouter.delete("/deletecontest", expressAsyncHandler(contestController.deleteContest)); 

contestRouter.get("/contest/:contestId/", expressAsyncHandler(contestController.getContest)); 

contestRouter.post("/contest/:contestId/submit", userCodeUpload, expressAsyncHandler(contestController.createSubmission));

contestRouter.get("/contest/:contestId/submissions", expressAsyncHandler(contestController.getSubmissions))

contestRouter.get("/contest/:contestId/results", expressAsyncHandler(contestController.getContestResults)); 

contestRouter.post("/contest/:contestId/createRun", expressAsyncHandler(contestController.createRun))

contestRouter.post("/contest/:contestId/invoke", expressAsyncHandler(contestController.invoke))

contestRouter.get("/contest/:contestId/invocations", expressAsyncHandler(contestController.getAllInvocations)); 

contestRouter.get("/contest/:contestId/invocationLog", expressAsyncHandler(contestController.getLogForInvocation)); 

contestRouter.use(serviceErrorHandler); 

export default contestRouter; 