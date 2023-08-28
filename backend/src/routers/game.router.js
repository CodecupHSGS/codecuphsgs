import { Router } from "express";

import { 
    createGame,
    getAllGames,
    getGame 
} from "../controllers/game.controller"

import gameFilesUpload from "../middlewares/gameJudgeUpload";

const gameRouter = Router(); 

gameRouter.get("/game/:gameId", getGame); 
gameRouter.get("/games", getAllGames); 
gameRouter.post("/games/create", gameFilesUpload, createGame); 

export default gameRouter; 