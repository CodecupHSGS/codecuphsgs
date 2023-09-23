"use client"; 

import { ContestResults, getResult } from "@/backend_api/contests";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useContestDetails from "../contest_details_hook";

export default function ResultPage() { 
    const params = useParams(); 
    const {contestDetails, setContestId} = useContestDetails(parseInt(params.contestId)); 
    const [contestResults, setcontestResults] = useState<null | ContestResults>(null); 
    
    const includeUnofficial = true; 

    async function callFetchContestResults() { 
        const new_results = await getResult(parseInt(params.contestId), includeUnofficial); 
        setcontestResults(new_results); 
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
    else if (contestResults === null) { 
        return null; 
    }
    else { 
        console.log(contestResults.results); 
        if(contestResults.finishedJudging) { 
            return <>{JSON.stringify(contestResults.results)}</>; 
        }
        else if(contestResults.startedJudging) { 
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