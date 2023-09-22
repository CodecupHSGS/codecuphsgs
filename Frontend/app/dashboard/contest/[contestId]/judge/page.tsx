"use client"; 

import alertBackendAPIError from "@/app/utils/alertSystem/alertBackendAPIError";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { FormEvent, useRef } from "react";
import { judgeContest } from "@/backend_api/contests";

export default function JudgePage() { 
    const params = useParams(); 
    const router = useRouter(); 
    const includeUnofficial = useRef(false); 

    async function onJudgeClicked(event: FormEvent) { 
        try { 
            await judgeContest({ 
                contestId: parseInt(params.contestId), 
                includeUnofficial: includeUnofficial.current
            }); 

            router.push(`/dashboard/contest/${params.contestId}/results`); 
        } catch(e) { 
            console.error("Encountered error when requesting to judge contest: ")
            console.error(e); 
            alertBackendAPIError(e, "JudgePage"); 
        }
    }

    function onIncludeUnofficialOptionSelected(event: FormEvent) { 
        const target = event.target as HTMLSelectElement; 
        const value = target.value; 
        if(value === "Yes") { 
            includeUnofficial.current = true; 
        }
        else { 
            includeUnofficial.current = false; 
        }
    }

    return (
        <form>
            <div className="border-b border-black pb-10 space-y-4">    
                <h2 className="text-base font-semibold leading-7 text-gray-900">Setting</h2>
                <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        Include unofficial submissions?
                    </label>
                    <select onChange={onIncludeUnofficialOptionSelected}>
                        <option>Yes</option>
                        <option selected>No</option>
                    </select>
                </div>
            </div>
            <div className="mt-6 flex items-center justify-center">
                <button type="submit" onClick={onJudgeClicked} className="rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">Judge Contest</button>
            </div>
        </form>
    )
}