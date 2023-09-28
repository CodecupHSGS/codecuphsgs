import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import gameControler from "../controllers/game.controller.js"

import gameFilesUpload from "../middlewares/gameJudgeUpload.js"

import serviceErrorHandler from "../middlewares/serviceErrorHandler.js";

const gameRouter = Router(); 

gameRouter.get("/game/:gameId", expressAsyncHandler(gameControler.getGame)); 

gameRouter.get("/games", expressAsyncHandler(gameControler.getAllGames)); 

gameRouter.post("/games/create", gameFilesUpload, expressAsyncHandler(gameControler.createGame)); 

gameRouter.use(serviceErrorHandler); 

export default gameRouter; 