"use client"; 

import { ContestResults, getResult } from "@/backend_api/contests";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useContestDetails from "../contest_details_hook";

export default function ResultPage() { 
    const params = useParams(); 
    const {contestDetails, setContestId} = useContestDetails(parseInt(params.contestId)); 
    const [results, setResults] = useState<null | ContestResults>(null); 
    
    const includeUnofficial = true; 

    async function callFetchContestResults() { 
        const new_results = await getResult(parseInt(params.contestId), includeUnofficial); 
        setResults(new_results); 
    }
    useEffect( () => { 
        callFetchContestResults();     
    }, []); 

    if(contestDetails && contestDetails.endDate >= new Date()) { 
        return (
            <div>
                This contest has not ended. &nbsp;
            </div>
        );
    }
    else if (results === null) { 
        return null; 
    }
    else { 
        if(results.finishedJudging) { 
            return <>{JSON.stringify(results)}</>; 
        }
        else if(results.startedJudging) { 
            return (
                <div>
                    This contest is being judged. &nbsp;
                </div>
            ); 
        }
        else { 
            return (
                <div>
                    This contest has not been judged. &nbsp;
                </div>
            ); 
        }
    }
}