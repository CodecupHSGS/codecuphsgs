import { Router } from "express";
import * as contestController from "../controllers/contest.controller.js"
import userCodeUpload from "../middlewares/userCodeUpload.js";

const contestRouter = Router(); 

contestRouter.get("/contest/:contestId/results", contestController.getContestResults)
contestRouter.get("/contests", contestController.getAllContests); 
contestRouter.post("/contests/create", contestController.createContest); 
contestRouter.get("/contest/:contestId/", contestController.getContest); 
contestRouter.delete("/deletecontest", contestController.deleteContest); 
contestRouter.post("/contest/:contestId/submit", userCodeUpload, contestController.createSubmission);
contestRouter.get("/contest/:contestId/submissions", contestController.getSubmissions)
contestRouter.get("/contest/:contestId/judge", contestController.judgeContest)

export default contestRouter; 