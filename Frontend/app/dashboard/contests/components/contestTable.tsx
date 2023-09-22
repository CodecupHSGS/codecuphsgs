import { ContestInfo } from "@/backend_api/contests";
import Link from "next/link";
import TimeAndDateHyperLink from "@/app/utils/timeanddate/timeanddate";

export default function ContestTable({contestList}: {contestList: ContestInfo[]}) { 
    return (
        <table className="w-full m-auto table-fixed font-light border-2 border-gray-900 rounded-lg border-separate overflow-scroll">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Start</th>
                    <th className="p-4">End</th>
                </tr>
            </thead>
            <tbody>
                {
                    contestList.map((contest, index) => (
                        <tr className=" border-gray-300 p-4 hover:border-gray-500 hover:rounded-sm hover:border-2" key={index}>
                            <td className="p-4">
                                <Link href={`/dashboard/contest/${contest.contestId}`}
                                    className="text-sm underline leading-6 text-gray-900">
                                    {contest.contestName}
                                </Link>
                            </td>
                            <td className="p-4"><TimeAndDateHyperLink message={contest.contestName + " (Begin)"} date={contest.startDate}/></td>
                            <td className="p-4"><TimeAndDateHyperLink message={contest.contestName + " (End)"} date={contest.startDate}/></td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}