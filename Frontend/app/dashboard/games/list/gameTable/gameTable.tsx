import { GameInfo } from "@/backend_api/games";
import Link from "next/link";

export default function GameTable({games}: {games: GameInfo[]}) { 
    let tableBody; 
    
    if(games === undefined || games === null || games.length === 0) { 
        tableBody = (
            <tr>
                <td colSpan={3} className="text-center p-4">
                    <p className="font-extralight italic">No game</p>
                </td>
            </tr>
        )
    }
    else { 
        tableBody = games.map((game, index) => (
            <tr className=" border-gray-300 p-4 hover:border-gray-500 hover:rounded-sm hover:border-2" key={index}>
                <td className="p-4">
                    {game.id}
                </td>
                <td className="p-4">
                    <Link href={`/dashboard/contest/${game.id}`}
                        className="text-sm underline leading-6 text-gray-900">
                        {game.name}
                    </Link>
                </td>
                <td className="p-4">{game.createdDate.toLocaleString()}</td>
            </tr>
        ))
    }

    return (
        <table className="w-full table-fixed font-light border-2 border-gray-900 rounded-lg border-separate">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Created Date</th>
                </tr>
            </thead>
            <tbody>
                {tableBody}
            </tbody>
        </table>
    )
}