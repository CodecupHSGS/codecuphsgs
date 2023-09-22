import { Router } from "express";

import { 
    createGame,
    getAllGames,
    getGame 
} from "../controllers/game.controller.js"

import gameFilesUpload from "../middlewares/gameJudgeUpload.js"
const gameRouter = Router(); 

gameRouter.get("/game/:gameId", getGame); 
gameRouter.get("/games", getAllGames); 
gameRouter.post("/games/create", gameFilesUpload, createGame); 

export default gameRouter; 