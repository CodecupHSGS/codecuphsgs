import GameModel from "../models/game.model.js";
import gameService from "../services/game.service.js"; 
import BadRequestError from "./errors/BadRequestError.js";
import UnauthorisedError from "./errors/UnauthorisedError.js";

import { gameInfoRestrictedView } from "../views/game.js";

/**
 * This controller handle requests to create a new game. Currently only admins can create a game. 
 */
async function createGame(req, res, next) { 
    const name = req.body.name; 

    if(typeof name !== "string") { 
        throw new BadRequestError("Game name is not a string"); 
    }

    if(!req.files['judgeFile'] || req.files['judgeFile'].length === 0) {         
        throw new BadRequestError("Missing judgeFile"); 
    }

    if(req.session.isAdmin !== true) { 
        throw new UnauthorisedError("User is not an admin"); 
    }

    const gameData = {
        name, 
        judgeUrl: req.files['judgeFile'][0].path
    }

    if(req.files['renderFile'] && req.files['renderFile'].length > 0) { 
        gameData.renderUrl = req.files['renderFile'][0].path; 
    }
    if(req.files['statementFile'] && req.files['statementFile'].length > 0) { 
        gameData.statementUrl = req.files['statementFile'][0].path;
    }

    const game = await gameService.createGame(gameData); 

    return res.status(200).send({msg: "created game"}); 
}

async function getAllGames(req, res, next) { 
    let games = await GameModel.find(); 

    if(!req.session.isAdmin) { 
        games = games.map(gameInfoRestrictedView); 
    }

    return res.status(200).send({
        games, 
        msg: "fetched game"
    }); 
}

async function getGame(req, res, next) { 
    let gameIdString = req.params.gameId; 

    if(isNaN(gameIdString)) { 
        throw new BadRequestError("GameId missing or is not a number"); 
    }

    const game = await gameService.getGame({gameId: parseInt(gameIdString)}); 
    
    if(!req.session.isAdmin) { 
        return res.status(200).send({
            game: gameInfoRestrictedView(game), 
            msg: "fetched game"
        }); 
    }
    else { 
        return res.status(200).send({
            game, 
            msg: "fetched game"
        }); 
    }
}

const gameControler = { 
    getAllGames, 
    getGame,
    createGame, 
}

export default gameControler; 