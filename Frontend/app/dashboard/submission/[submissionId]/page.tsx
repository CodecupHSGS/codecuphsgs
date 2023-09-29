"use client"; 

import { SubmissionInfo, getSubmission } from "@/backend_api/contests";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function SubmissionPage() { 
    const params = useParams(); 

    const submissionId = parseInt(params.submissionId); 

    const [submission, setSubmission] = useState<SubmissionInfo | null>(null); 

    async function fetchSubmissionAndRerender() {
        const fetchedSubmission = await getSubmission({submissionId}); 
        setSubmission(fetchedSubmission); 
    }

    if(submission == null) { 
        fetchSubmissionAndRerender(); 
        return null; 
    }

    return (
        <div className="w-full h-full border-black border-3 p-5 overflow-auto">
            <a href={`/api/submission/${submissionId}/downloadSource`}
                className="underline">
                Download source code
            </a>
        </div>
    )
}