import fs from "fs"

import GameModel from "../models/game.model.js";

import ConflictError from "./errors/conflictError.js";
import ValidationError from "./errors/validationError.js"

async function createGame({name, judgeUrl, ...rest}) { 
    if(typeof name != "string" || typeof judgeUrl != "string") { 
        throw new ValidationError("Missing or wrong parameter type of name or judgeUrl"); 
    }
    
    if(!fs.existsSync(judgeUrl)) { 
        throw new ValidationError("Judge file does not exist"); 
    }

    const game = await GameModel.create({
        id: await GameModel.count() + 1, 
        name, 
        judgeUrl, 
        ...rest
    })

    return game; 
}

async function getGame({gameId}) { 
    if(typeof gameId !== "number") { 
        throw new ValidationError("Missing or wrong type of gameId"); 
    }

    const gameDocument = await GameModel.findOne({
        id: gameId
    })


    if(!gameDocument) { 
        throw new ConflictError("No game with such gameId"); 
    }

    return gameDocument.toObject(); 
}

const gameService = { 
    getGame, 
    createGame
}

export default gameService; 