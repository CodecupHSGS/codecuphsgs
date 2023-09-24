import { FormEvent, useState } from "react";

export default function FileSelect({file, setFile}: {file: null | File, setFile: Function}) { 
    const [dragActive, setDragActive] = useState<boolean>(false); 

    // function handleDrag(event) {
    //     event.preventDefault(); 
    //     event.stopPropagation(); 
    //     if(event.type == "dragenter" || event.type == "dragover") { 
    //         setDragActive(true); 
    //     } else if (event.type == "dragleave") { 
    //         setDragActive(false); 
    //     }
    // }

    // function handleDrop(event) { 
    //     event.preventDefault(); 
    //     event.stopPropagation(); 
    //     setDragActive(false); 
    //     console.log("dropped!!!"); 
    //     console.log(event.dataTransfer); 
    //     if(event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) { 
    //         setFile(file); 
    //     }
    // }
    function handleFileSelected(event: FormEvent) {
        event.preventDefault(); 

        const target = event.target as HTMLInputElement; 
        if(target && target.files && target.files[0]) { 
            setFile(target.files[0]); 
        }
    }

   return (
        <div className="grid grid-cols-1 sm:grid-cols-6">
            <div className="col-span-full">
                <div 
                    // onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                    className={`flex flex-col justify-center items-center rounded-lg border ${dragActive?"border-sky-500": "border-dashed border-gray-900/25"} py-4`}>
                    <div className="text-center">
                        <div className="flex flex-center text-sm leading-6 text-gray-600">
                            <label className="relative cursor-pointer rounded-md bg-white font-semibold text-black focus-within:outline-none focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2 hover:text-blue-700">
                                <span>Select file</span>
                                <input type="file" accept="text/x-c .cpp" className="sr-only" onChange={handleFileSelected}></input>
                            </label>
                            {/* <p className="pl-1"> or drag and drop</p> */}
                        </div>
                    </div>
                    <div className="text-xs leading-5 text-gray-700">{file?file.name: "No file selected"}</div>
                </div>
            </div>
        </div>
   )
}