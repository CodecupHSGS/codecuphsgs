import { Invocation } from "@/backend_api/contests";
import { useParams } from "next/navigation";
export default function InvocationTable({invocations}: {invocations: Invocation[]}) { 
    const params = useParams(); 

    function createPlayerTag(subId: number, invo: Invocation) { 
        const didWin = subId === invo.winner; 
        if(invo.finishedJudging !== true) { 
            return <p>{subId}</p>; 
        }
        if(didWin) { 
            return <p className="text-green-700">{subId} (W)</p>; 
        }
        else { 
            return <p className="text-red-700">{subId} (L)</p>; 
        }
    }

    invocations.sort((a, b) => { 
        if(a.createdDate < b.createdDate) { 
            return 1; 
        }
        if(a.createdDate > b.createdDate) { 
            return -1; 
        }
        return 0; 
    })

    const tableBody = invocations === undefined || invocations === null || invocations.length === 0? 
        (
            <tr>
                <td colSpan={4} className="text-center p-4">
                    <p className="font-extralight italic">No invocation</p>
                </td>
            </tr>
        ): 
        invocations.map((invocation, index) => { 
            const firstPlayerTag = createPlayerTag(invocation.submission1Id, invocation); 
            const secondPlayerTag = createPlayerTag(invocation.submission2Id, invocation);

            const viewResultTag = invocation.finishedJudging? 
                <a className="text-blue-700" 
                    target="_blank"
                    href={`/api/contest/${params.contestId}/invocationLog?invocationId=${invocation.invocationId}`}>
                    Download log
                </a>
                : <>Judging</>; 

            return (
                <tr className="p-4" key={index}>
                    <td className="p-4">{invocation.createdDate.toLocaleString()}</td>
                    <td className="p-4">{firstPlayerTag}</td>
                    <td className="p-4">{secondPlayerTag}</td>
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
                    <th className="p-4">View result</th>
                </tr>
            </thead>
            <tbody>
                {tableBody}
            </tbody>
        </table>
    )
}