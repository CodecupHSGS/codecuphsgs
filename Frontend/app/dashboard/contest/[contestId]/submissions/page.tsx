"use client"; 

import { SubmissionInfo, getSubmissions } from "@/backend_api/contests";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react"
import SubmissionTable from "./components/submissionTable";

export default function Submissions () { 
    const params = useParams(); 
    const [submissionsInfo, setSubmissionsInfo] = useState<null|Array<SubmissionInfo>>(null); 
    const includeUnofficial = true; 

    async function fetchSubmissionsInfo() {
        const submissions = await getSubmissions({contestId: parseInt(params.contestId), includeUnofficial})
        setSubmissionsInfo(submissions); 
    }

    useEffect(() => { 
        fetchSubmissionsInfo();  
    }, [])

    if(!submissionsInfo) { 
        return null; 
    }

    return (
        <SubmissionTable submissions={submissionsInfo}/>
    )
}