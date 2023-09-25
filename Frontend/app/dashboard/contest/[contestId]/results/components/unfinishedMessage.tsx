import { ContestResults } from "@/backend_api/contests"

export default function UnfinishedMessage({
    results, 
}: { 
    results: ContestResults, 
}) { 
    const message = results.startedJudging? `The latest run is being judged (Run created at ${results.createdDate.toLocaleString()})`: "There are no past runs"; 
    return (
        <div className="w-full h-full p-6 flex flex-col gap-y-6 items-center">
            <p className="italic text-gray-500 ">{message}</p>
        </div>
    ); 
}