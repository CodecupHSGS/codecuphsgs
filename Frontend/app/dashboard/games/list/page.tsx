"use client";

import alertBackendAPIError from "@/app/utils/alertSystem/alertBackendAPIError";
import { GameInfo, getAllGamesInfo } from "@/backend_api/games";
import { useEffect, useState } from "react";
import Link from "next/link";
 

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
    
    return (
        <div>
            {
                gameInfos == null? 
                    "No games found": 
                    <table className="w-full table-auto font-light border-2 border-gray-200">
                        <thead className="bg-gray-100 rounded-xl">
                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                gameInfos.map((game, index) => (
                                    <tr className=" border-gray-300 p-4 hover:shadow-md" key={index}>
                                        <td>{game.id}</td>
                                        <td className="p-4">
                                            <Link href={`/dashboard/game/${game.id}`}
                                                className="text-sm underline leading-6 text-gray-900">
                                                {game.name}
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
            }
        </div>
    )
}