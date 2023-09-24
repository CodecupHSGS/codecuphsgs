"use client"; 

import { FormEvent, useContext, useEffect, useState } from "react"
import { useParams,useRouter} from "next/navigation";
import { submitCode } from "@/backend_api/contests";
import alertBackendAPIError from "@/app/utils/alertSystem/alertBackendAPIError";
import FileSelect from "@/app/dashboard/utils/fileUpload";
import { contestDetailsContext } from "../layout";
import { retrieveUserInfo, UserInfo } from "@/session_storage_api/api";
import { userInfoContext } from "@/app/dashboard/layout";

export default function SubmitPage() { 

    const router = useRouter(); 
    const params = useParams(); 

    const userInfo = useContext(userInfoContext); 
    const contestDetails = useContext(contestDetailsContext); 

    const [file, setFile] = useState<File | null>(null); 
    const [isOfficial, setIsOfficial] = useState(false); 

    function handleCancel(event: FormEvent) { 
        event.preventDefault(); 
        setFile(null); 
    }

    function onCheckBoxChanged() { 
        setIsOfficial((value) => !value); 
    }

    async function handleSubmit(event: FormEvent) { 
        event.preventDefault(); 

        if(file) { 
           try { 
               let submission = await submitCode({contestId: parseInt(params.contestId), file}); 

               alert("Submitted!"); 

               router.push(`/dashboard/contest/${params.contestId}/`);    
           }
           catch (error){ 
               alertBackendAPIError(error, "SubmissionSubmitHandler"); 
           }
        }
        else { 
           alert("No file selected!"); 
        }
   }

   if(userInfo === null || contestDetails == null) { 
        return null; 
   }
    
   console.log(isOfficial); 
   const currentDate = new Date();  
   const isContestOngoing = contestDetails.startDate <= currentDate && currentDate <= contestDetails.endDate; 

   const submitOption =  isContestOngoing && !userInfo.userIsAdmin? 
        (
            <form className="w-full p-4">
                <label>
                    <input type="checkbox" checked={isOfficial} onChange={onCheckBoxChanged}/>
                        &nbsp;
                    Submit officially 
                </label>
            </form>
        ): 
        (
            <div>
                <p className="p-4 text-red-900 italic"> You can only submit unofficially. </p>
           </div>
        )

    return (
        <form> 
            <div className="border-b pb-12">
                
                <h2 className="text-base font-semibold leading-7 text-gray-900">Submit code</h2>

                {submitOption}

                <p className="mt-1 text-sm leading-6 text-gray-600">Upload your source code here (.cpp files only). </p>

                <FileSelect file={file} setFile={setFile}/>

                <div className="mt-6 flex items-center justify-center gap-x-6">
                    <button type="button" onClick={handleCancel} 
                        className="text-sm font-semibold leading-6 text-gray-900">
                        Cancel
                    </button>
                    <button type="submit" onClick={handleSubmit}
                        className="rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
                        Submit
                    </button>
                </div>
            </div>
        </form>
        )
}