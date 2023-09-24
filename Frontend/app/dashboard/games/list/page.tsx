"use client";

import alertBackendAPIError from "@/app/utils/alertSystem/alertBackendAPIError";
import { GameInfo, getAllGamesInfo } from "@/backend_api/games";
import { useEffect, useState } from "react";
import GameTable from "./gameTable/gameTable"; 

export default function GameListPage() {

    const [gameInfos, setGameInfos] = useState<null | Array<GameInfo> >(null); 

    async function fetchGameInfo() {
        try { 
            const gamesInfo = await getAllGamesInfo(); 
            
            setGameInfos(gamesInfo);
        } catch(error: any) { 
            alertBackendAPIError(error, "gamesInfoFetcher"); 
        }
    }

    useEffect(() => { 
        fetchGameInfo(); 
    }, []); // run only once when mounted

    if(gameInfos === null) { 
        return null; 
    }
    
    return (
        <GameTable games={gameInfos}/>
    )
}