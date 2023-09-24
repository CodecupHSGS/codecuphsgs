import { type } from "os";
import UnknownInternalError from "./errors/unknownInternalError";
import ValidationError from "./errors/validationError";
import validateResponse from "./validation_utils/validateResponse"

interface GameInfo { 
    id: number, 
    name: string, 
    statementUrl: string, 
    renderUrl: string, 
    createdDate: Date
}

async function createGame({
    name, 
    statementFile, 
    renderFile, 
    judgeFile
}: { 
    name: string, 
    statementFile: File | null, 
    renderFile: File | null, 
    judgeFile: File
}) {
    if(typeof name !== "string") { 
        throw new ValidationError("name is not of type string"); 
    }
    if(!judgeFile) { 
        throw new ValidationError("Missing judge file"); 
    }

    const formData = new FormData(); 

    formData.append('name', name); 
    if(statementFile !== null) formData.append('statementFile', statementFile); 
    if(renderFile !== null) formData.append('renderFile', renderFile); 
    formData.append('judgeFile', judgeFile); 
    
    const response = await fetch("/api/games/create", 
        { 
            method: "POST", 
            body: formData
        }
    ); 

    const {status, body} = await validateResponse(response); 
}

async function getGameInfo(
    gameId: number
): Promise<GameInfo> {

    if(typeof gameId != "number") { 
        throw new ValidationError("type of gameId is not number"); 
    }

    const response = await fetch(`/api/game/${gameId}`); 

    const {status, body} = await validateResponse(response); 

    try { 
        const game = body.game; 
        return {
            id: game.id, 
            name: game.name, 
            statementUrl: game.statementUrl, 
            renderUrl: game.renderUrl, 
            createdDate: new Date(game.createdDate)
        }
    } 
    catch(error: any) {
        console.error("Unknown error at get game API: " + error); 
        throw new UnknownInternalError(); 
    }
}

async function getAllGamesInfo(): Promise<Array<GameInfo>>{
    const response = await fetch(`/api/games`, { // hudge mistake: api/games -> /api/games!!!!!
        method: "GET"
    }); 
    
    const {status, body} = await validateResponse(response); 

    try { 
        return body.games.map((game: any) => { 
            return { 
                id: game.id, 
                name: game.name, 
                statementUrl: game.statementUrl, 
                ...(game.judgeUrl != undefined && {
                    judgeUrl: game.judgeUrl
                }), 
                renderUrl: game.renderUrl, 
                createdDate: new Date(game.createdDate)
            }
        });
    } catch(error: any) { 
        console.error("Unknown error at get all games API: " + error); 
        throw new UnknownInternalError(); 
    }
}

export { 
    getAllGamesInfo, 
    getGameInfo, 
    createGame
}

export type { 
    GameInfo
}