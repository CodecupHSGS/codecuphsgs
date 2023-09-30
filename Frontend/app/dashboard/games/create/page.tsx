"use client"; 

import alertBackendAPIError from "@/app/utils/alertSystem/alertBackendAPIError";
import { createGame } from "@/backend_api/games";
import { redirect, useRouter } from "next/navigation";
import { FormEvent, useContext, useState } from "react";
import FileSelect from "../../utils/fileUpload";
import { userInfoContext } from "../../layout";

export default function CreateGamePage() {
    const router = useRouter(); 

    const userInfo = useContext(userInfoContext); 
    
    const [name, setName] = useState(""); 
    const [statementFile, setStatementFile] = useState<null|File>(null); 
    const [judgeFile, setJudgeFile] = useState<null|File>(null);    


    function onNameUpdate(event: FormEvent) { 
        const target = event.target as HTMLInputElement; 
        setName(target.value);  
    }

    async function onFormSubmit(event:FormEvent) {
        event.preventDefault(); 

        if(!statementFile) { 
            alert("Warning: no statement file chosen"); 
        }

        if(!judgeFile) { 
            alert("Error: missing judge file"); 
        }

        else { 
            try { 
                await createGame({ 
                    name, 
                    statementFile: statementFile, 
                    renderFile: null, 
                    judgeFile: judgeFile, 
                }); 

                router.push("/dashboard/games/list"); 
            }
            catch(error) { 
                alertBackendAPIError(error, "contestCreateSubmitHandler"); 
            }
        }
    }

    console.log(userInfo); 

    // Server side render | first render
    if(userInfo === null) { 
        return null; 
    }

    // Not logged in
    if(userInfo.userIsAdmin === undefined) { 
        router.push("/authentication/login"); 
    }

    if(userInfo.userIsAdmin !== true) { 
        alert("Admin-only page"); 
        redirect("/dashboard"); 
    }

    return (
        <form className="w-1/2 m-auto mt-20 flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-4 pb-12 border-b border-gray-900/10">

                <h2 className="w-full text-center text-base font-semibold text-gray-900">Game Information</h2>

                <label className="block text-sm font-medium leading-6 text-gray-900">
                    Name
                    <input type="text" onChange={onNameUpdate}  className="block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-black">
                    </input>
                </label>
                    

                <div className="w-full">
                    <label  className="block text-sm font-medium leading-6 text-gray-900">Judge file (.cpp) </label>
                    <FileSelect file={judgeFile} setFile={setJudgeFile}/>
                </div>

                <div className="w-full">
                    <label  className="block text-sm font-medium leading-6 text-gray-900">Statement (.pdf) </label>
                    <FileSelect file={statementFile} setFile={setStatementFile}/>
                </div>
            </div>
            <div className="w-full flex flex-col justify-center items-center">
                <button 
                    type="submit" 
                    onClick={onFormSubmit} 
                    className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
                    Create
                </button>
            </div>
        </form>
    ); 
}