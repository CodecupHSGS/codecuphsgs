import { FormEvent, useState } from "react"
import { runInvocation } from "@/backend_api/contests";
import { useParams, usePathname, useRouter } from "next/navigation";
import alertBackendAPIError from "@/app/utils/alertSystem/alertBackendAPIError";
export default function RunInvocationForm({ 
    onRun
}: { 
    onRun: () => void
}) { 
    const params = useParams(); 
    const pathname = usePathname(); 
    const router = useRouter(); 

    const [submission1Id, setSubmission1Id] = useState<null | string>(null)
    const [submission2Id, setSubmission2Id] = useState<null | string>(null); 

    function onSubmission1IdChange(event: FormEvent) { 
        const target = event.target as HTMLInputElement; 
        setSubmission1Id(target.value); 
    }

    function onSubmission2IdChange(event: FormEvent) { 
        const target = event.target as HTMLInputElement; 
        setSubmission2Id(target.value); 
    }

    async function onRunButtonClick(event:FormEvent) {
        event.preventDefault(); 

        if(submission1Id === null || submission2Id === null)  { 
            alert("Submission ID is missing"); 
            return; 
        }

        try { 
            await runInvocation({
                submission1Id: parseInt(submission1Id), 
                submission2Id: parseInt(submission2Id), 
                contestId: parseInt(params.contestId)
            }); 

            router.push(pathname); 
        } catch(e) { 
            alertBackendAPIError(e, "Run invocation form"); 
        }

        // Calling the callback from parent component
        onRun(); 
    }

    return (
        <form className="rounded-lg border-2 border-black overflow-hidden">
            <h2 className="leading-6 p-3 font-semibold bg-gray-100">Run a new invocation</h2>
            <div className="p-3">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                    First submission's ID
                </label>
                <input 
                    onChange={onSubmission1IdChange}
                    className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black">
                </input>
            </div>
            <div className="p-3">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                    Second submission's ID
                    <input 
                        onChange={onSubmission2IdChange}
                        className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black">
                    </input>
                </label>
            </div>
            <div className="p-6 flex items-center justify-center gap-x-6">
                <button type="submit" onClick = {onRunButtonClick} className="rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
                    Run
                </button>
            </div>
        </form>
    )
}