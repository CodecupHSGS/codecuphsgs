"use client";

import { useContext, useState } from "react";
import FileSelect from "../utils/fileUpload";
import { customRun } from "@/backend_api/customRun";
import alertBackendAPIError from "@/app/utils/alertSystem/alertBackendAPIError";
import { userInfoContext } from "../layout";
import { redirect } from "next/navigation";

export default function CustomRun() { 
    const userInfo = useContext(userInfoContext); 

    if(userInfo === null) { 
        return null; 
    }

    if(userInfo.userId == null) { 
        redirect("/authentication/login"); 
    }

    const [judgeFile, setJudgeFile] = useState<File | null>(null); 
    const [sourceFile1, setSourceFile1] = useState<File | null>(null); 
    const [sourceFile2, setSourceFile2] = useState<File | null>(null); 

    function handleCancel() { 
        setJudgeFile(null); 
        setSourceFile1(null); 
        setSourceFile2(null); 
    }

    async function handleSubmit() { 
        if(judgeFile === null || sourceFile1 === null || sourceFile2 === null) { 
            alert("Missing file"); 
            return; 
        }

        try { 
            const logUrl = await customRun({judgeFile, sourceFile1, sourceFile2}); 
            const link = document.createElement("a"); 
            link.href = logUrl; 
            link.download = "log.txt"; 
            document.body.appendChild(link); 
            link.click(); 
            link.parentNode?.removeChild(link); 
            URL.revokeObjectURL(link.href); 
        } catch(err) { 
            console.error(err); 
            alertBackendAPIError(err, "customRun"); 
        }
    }

    return (
        <div className="w-1/2 m-auto mt-10 rounded-lg border-2 border-black overflow-hidden">
            <div className="flex flex-col border-b-2 border-gray-400">
                <h2 className="leading-6 p-3 font-semibold bg-gray-100">Run a new invocation</h2>
                <div className="flex flex-col gap-y-4 p-6">
                    <div>
                        <p className="mt-1 text-sm leading-6 text-gray-600"> Judge file (.cpp) </p>
                        <FileSelect file={judgeFile} setFile={setJudgeFile}/>
                    </div>
                    <div>
                        <p className="mt-1 text-sm leading-6 text-gray-600"> Judge file (.cpp) </p>
                        <FileSelect file={sourceFile1} setFile={setSourceFile1}/>
                    </div>
                    <div>
                        <p className="mt-1 text-sm leading-6 text-gray-600"> Judge file (.cpp) </p>
                        <FileSelect file={sourceFile2} setFile={setSourceFile2}/>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-x-6">
                        <button type="button" onClick={handleCancel} 
                            className="text-sm font-semibold leading-6 text-gray-900">
                            Cancel
                        </button>
                        <button type="submit" onClick={handleSubmit}
                            className="rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
                            Run and download log
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}