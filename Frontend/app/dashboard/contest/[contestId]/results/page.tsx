"use client"; 

import { ContestResults, getResult } from "@/backend_api/contests";
import { FormEvent, useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { contestDetailsContext } from "../layout";
import UnfinishedRun from "./components/unfinishedMessage";
import RunResultsDisplay from "./components/runResultsDisplay";

export default function ResultPage() { 
    const params = useParams(); 
    const contestDetails = useContext(contestDetailsContext);  
    const [results, setResults] = useState<null | ContestResults>(null); 
    
    const [includeUnofficial, setIncludeUnofficial] = useState<boolean> (false); 

    async function fetchAndSetContestResults() { 
        const fetchedResults = await getResult({ 
            contestId: parseInt(params.contestId), 
            includeUnofficial
        });  
        setResults(fetchedResults); 
    }

    // first render and every time the variable is updated
    useEffect( () => { 
        console.log("WTF"); 
        fetchAndSetContestResults();     
    }, [includeUnofficial]); 

    if(contestDetails === null || results === null) { 
        return null; 
    }

    function onCheckBoxChanged(event: FormEvent) { 
        const target = event.target as HTMLInputElement; 
        setIncludeUnofficial(target.checked); 
    }

    return (
        <div className="w-full h-full flex flex-col gap-x-8">
            <div className="w-full">
                <label> 
                    <input type="checkbox" onChange={onCheckBoxChanged}/>
                    &nbsp; Include unofficial
                </label>
            </div>   
            <RunResultsDisplay results={results}/>
        </div>
    )
}