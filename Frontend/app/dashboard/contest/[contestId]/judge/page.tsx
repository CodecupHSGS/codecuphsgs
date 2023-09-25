"use client"; 

import alertBackendAPIError from "@/app/utils/alertSystem/alertBackendAPIError";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import { createRun } from "@/backend_api/contests";

export default function JudgePage() { 
    const params = useParams(); 
    const router = useRouter(); 
    const [includeUnofficial, setIncludeUnofficial] = useState(false); 

    async function onJudgeClicked(event: FormEvent) { 
        event.preventDefault(); 

        try { 
            await createRun({ 
                contestId: parseInt(params.contestId), 
                includeUnofficial
            }); 

            router.push(`/dashboard/contest/${params.contestId}/results`); 
        } catch(e) { 
            console.error("Encountered error when requesting to judge contest: " + e)
            alertBackendAPIError(e, "JudgePage"); 
        }
    }

    function onCheckBoxChanged(event: FormEvent) { 
        const target = event.target as HTMLInputElement; 
        setIncludeUnofficial(target.checked); 
    }

    return (
        <div className="w-1/2 m-auto mt-10">
            <div className="border-b border-black pb-10 space-y-4">    
                <h2 className="text-base font-semibold leading-7 text-gray-900">Setting</h2>
                <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        <input type="checkbox" onChange={onCheckBoxChanged}/>&nbsp; 
                        Include unofficial submissions
                    </label>
                </div>
            </div>
            <div className="mt-6 flex items-center justify-center">
                <button type="submit" onClick={onJudgeClicked} className="rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
                    Start a new run
                </button>
            </div>
        </div>
    )
}