"use client"; 

import { SubmissionInfo, getSubmissions } from "@/backend_api/contests";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react"
import SubmissionTable from "./components/submissionTable";
import SubmissionFilter from "./components/submissionFilter";

export default function Submissions () { 
    const params = useParams(); 
    const [submissionsInfo, setSubmissionsInfo] = useState<null|Array<SubmissionInfo>>(null); 
    const [includeUnofficial, setIncludeUnofficial] = useState(true); 

    async function fetchAndSetSubmissionsInfo() {
        const fetchedFubmissions = await getSubmissions({contestId: parseInt(params.contestId), includeUnofficial})
        setSubmissionsInfo(fetchedFubmissions); 
    }

    // After first render 
    useEffect(() => { 
        fetchAndSetSubmissionsInfo(); 
    }, [])

    async function onIncludeUnofficialFlipped() { 
        setIncludeUnofficial(value => !value); 
    }

    if(!submissionsInfo) { 
        return null; 
    }

    const filteredSubmissions = includeUnofficial? 
        submissionsInfo: submissionsInfo.filter(submission => submission.isOfficial); 

    return (
        <div className="w-full">
            <SubmissionFilter onIncludeUnofficialFlipped={onIncludeUnofficialFlipped}/>
            <SubmissionTable submissions={filteredSubmissions}/>
        </div>
    )
}