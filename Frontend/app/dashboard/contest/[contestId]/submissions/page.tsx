"use client"; 

import { SubmissionInfo, getSubmissions } from "@/backend_api/contests";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react"

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
        return <>Loading...</>
    }

    return (
        <table className="w-full table-auto font-light border-2 border-gray-200">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-4">Submission ID</th>
                    <th className="p-4">Author</th>
                    <th className="p-4">Submission Date</th>
                </tr>
            </thead>
            <tbody>
                {
                    submissionsInfo.map((submission, index) => (
                        <tr className=" border-gray-300 p-4 hover:shadow-md" key={index}>
                            <td className="p-4">
                                {submission.submissionId}
                            </td>
                            <td className="p-4">{submission.username}</td>
                            <td className="p-4">{submission.submissionDate.toLocaleString()}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}