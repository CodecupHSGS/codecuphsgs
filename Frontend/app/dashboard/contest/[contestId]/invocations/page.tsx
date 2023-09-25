"use client"; 

import { useContext, useEffect, useState } from "react";
import { contestDetailsContext } from "../layout";
import RunInvocationForm from "./components/runInvocationForm";
import InvocationTable from "./components/invocationsTable";
import { Invocation, getAllInvocations } from "@/backend_api/contests";
import { useParams } from "next/navigation";

export default function InvocationsPage() { 
    const params = useParams(); 

    const contestDetails = useContext(contestDetailsContext);

    const [invocations, setInvocations] = useState<null | Invocation[]>(null); 

    console.log(contestDetails); 

    async function fetchAndSetInvocations() {
        const newInvocations = await getAllInvocations({contestId: parseInt(params.contestId)});
        setInvocations(newInvocations);  
    }

    // After first render
    useEffect(() => { 
        fetchAndSetInvocations(); 
    }, [])

    function onNewInvocationRun() { 
        fetchAndSetInvocations(); 
    }

    if(contestDetails === null || invocations === null) { 
        return null; 
    }

    return (
        <div className="w-full h-full flex">
            <div className="w-2/3 pr-4"> 
                <InvocationTable invocations={invocations}/>
            </div>
            <div className="w-1/3 pl-4 pr-4">
                <RunInvocationForm onRun={onNewInvocationRun}/>
            </div>
        </div>
    )
}