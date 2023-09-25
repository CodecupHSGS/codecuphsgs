import { Invocation } from "@/backend_api/contests";
export default function InvocationTable({invocations}: {invocations: Invocation[]}) { 
    const tableBody = invocations === undefined || invocations === null || invocations.length === 0? 
        (
            <tr>
                <td colSpan={4} className="text-center p-4">
                    <p className="font-extralight italic">No invocation</p>
                </td>
            </tr>
        ): 
        invocations.map((invocation, index) => { 
            const firstPlayerTag = <p className="text-green-900">{invocation.submission1Id}</p>
            const secondPlayerTag = <p className="text-red-900">{invocation.submission2Id}</p>; 
            const winnerPlayerTag = invocation.finishedJudging? (invocation.winner === invocation.submission1Id? firstPlayerTag: secondPlayerTag)
                : <p className="text-gray-700">Judging</p>
            const viewResultTag = invocation.finishedJudging? <p>View log</p>: <></>; 

            return (
                <tr className="p-4" key={index}>
                    <td className="p-4">{invocation.createdDate.toLocaleString()}</td>
                    <td className="p-4">{firstPlayerTag}</td>
                    <td className="p-4">{secondPlayerTag}</td>
                    <td className="p-4">{winnerPlayerTag} </td>
                    <td className="p-4"> {viewResultTag}</td>
                </tr>
            )
        }); 

    return (
        <table className="w-full table-fixed font-light border-2 border-gray-900 rounded-lg border-separate">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">First submission</th>
                    <th className="p-4">Second submission</th>
                    <th className="p-4">Winner</th>
                    <th className="p-4">View result</th>
                </tr>
            </thead>
            <tbody>
                {tableBody}
            </tbody>
        </table>
    )
}