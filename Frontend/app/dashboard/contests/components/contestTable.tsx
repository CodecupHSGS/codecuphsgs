import { ContestInfo } from "@/backend_api/contests";
import Link from "next/link";
export default function ContestTable({contestList}: {contestList: ContestInfo[]}) { 
    return (
        <table className="w-full table-auto font-light border-2 border-gray-200">
            <thead className="bg-gray-100 rounded-xl">
                <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Start</th>
                    <th className="p-4">End</th>
                </tr>
            </thead>
            <tbody>
                {
                    contestList.map((contest) => (
                        <tr className=" border-gray-300 p-4 hover:shadow-md">
                            <td className="p-4">
                                <Link href={`/dashboard/contest/${contest.contestId}`}
                                    className="text-sm underline leading-6 text-gray-900">
                                    {contest.contestName}
                                </Link>
                            </td>
                            <td className="p-4">{contest.startDate.toLocaleString()}</td>
                            <td className="p-4">{contest.endDate.toLocaleString()}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}