"use client"; 

import alertBackendAPIError from "@/app/utils/alertSystem/alertBackendAPIError";
import { createGame } from "@/backend_api/games";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import FileSelect from "../../components/fileUpload";

export default function CreateGamePage() {

    const router = useRouter(); 
    
    const [name, setName] = useState(""); 
    const [statementFile, setStatementFile] = useState<null|File>(null); 
    const [renderFile, setRenderFile] = useState<null|File>(null); 
    const [judgeFile, setJudgeFile] = useState<null|File>(null); 


    function onNameUpdate(event: FormEvent) { 
        const target = event.target as HTMLInputElement; 
        setName(target.value);  
    }

    async function onFormSubmit(event:FormEvent) {
        event.preventDefault(); 

        if(!statementFile) { 
            alert("Missing statement file"); 
        }

        else if(!renderFile) { 
            alert("Missing render file"); 
        }

        else if(!judgeFile) { 
            alert("Missing judge file"); 
        }

        else { 

            try { 
                await createGame({ 
                    name, 
                    statementFile: statementFile, 
                    renderFile: renderFile, 
                    judgeFile: judgeFile, 
                }); 

                router.push("/dashboard/games/list"); 
            }
            catch(error) { 
                alertBackendAPIError(error, "contestCreateSubmitHandler"); 
            }
        }
    }

    return (
        <form>
            <div className="border-b border-gray-900/10 pb-12 gap-y-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Game Information</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600"></p>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium leading-6 text-gray-900">Name</label>
                    <div className="mt-2">
                        <input type="text" onChange={onNameUpdate}  className="block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6">
                        </input>
                    </div>
                </div>

                <div className="sm:col-span-3">
                    <label  className="block text-sm font-medium leading-6 text-gray-900">Judge file (.cpp) </label>
                    <FileSelect file={judgeFile} setFile={setJudgeFile}/>
                </div>

                <div className="sm:col-span-3">
                    <label  className="block text-sm font-medium leading-6 text-gray-900">Render file (.js) </label>
                    <FileSelect file={renderFile} setFile={setRenderFile}/>
                </div>

                <div className="sm:col-span-3">
                    <label  className="block text-sm font-medium leading-6 text-gray-900">Statement (.pdf) </label>
                    <FileSelect file={statementFile} setFile={setStatementFile}/>
                </div>
            </div>
            <div className="mt-6 flex items-center justify-center gap-x-6">
                <button type="submit" onClick={onFormSubmit} className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">Publish</button>
            </div>
        </form>
    ); 
}