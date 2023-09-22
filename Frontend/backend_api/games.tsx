import { type } from "os";
import UnknownInternalError from "./errors/unknownInternalError";
import ValidationError from "./errors/validationError";
import validateResponse from "./validation_utils/validateResponse"

interface GameInfo { 
    id: number, 
    name: string, 
    statementUrl: string, 
    renderUrl: string
}

async function createGame({
    name, 
    statementFile, 
    renderFile, 
    judgeFile
}: { 
    name: string, 
    statementFile:File, 
    renderFile: File, 
    judgeFile: File
}) {
    if(!statementFile || !renderFile || !judgeFile) { 
        throw new ValidationError("Missing files"); 
    }

    const formData = new FormData(); 

    formData.append('name', name); 
    formData.append('statementFile', statementFile); 
    formData.append('renderFile', renderFile); 
    formData.append('judgeFile', judgeFile); 
    
    const response = await fetch("/api/games/create", 
        { 
            method: "POST", 
            // headers: {
            //     'Content-Type': 'multipart/form-data'
            // }, 
            // FOR SOME REASON, ONLY WORKS IF I REMOVE content-type
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
                renderUrl: game.renderUrl
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
                renderUrl: game.renderUrl
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