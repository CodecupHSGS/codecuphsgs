import validateResponse from "./validation_utils/validateResponse";

async function customRun({ 
    judgeFile, 
    sourceFile1, 
    sourceFile2
}: {
    judgeFile: File, 
    sourceFile1: File, 
    sourceFile2: File    
}) { 
    const formData = new FormData(); 
    formData.append("judgeFile", judgeFile); 
    formData.append("sourceFile1", sourceFile1); 
    formData.append("sourceFile2", sourceFile2); 

    const response = await fetch("/api/customRun", { 
        method: "POST", 
        body: formData
    }); 

    if(!response.ok) { 
        const { status, body} = await validateResponse(response); 
    }
    const text = await response.text(); 
    const blob = new Blob([text], )
    return URL.createObjectURL(blob); 
}

export { 
    customRun
}