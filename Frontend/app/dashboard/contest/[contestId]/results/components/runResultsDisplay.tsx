import { ContestResults } from "@/backend_api/contests"
import UnfinishedMessage from "./unfinishedMessage";

export default function RunResultsDisplay({
    results, 
}: { 
    results: ContestResults, 
}) { 
    if(results.finishedJudging !== true) { 
        return <UnfinishedMessage results={results}/>
    }

    return (
        <div className="w-full h-full p-6 flex flex-col gap-y-6 items-center">
            <p className="italic text-gray-500 ">{JSON.stringify(results)}</p>
        </div>
    ); 
}