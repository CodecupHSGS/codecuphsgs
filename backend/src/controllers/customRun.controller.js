import assert from "assert";
import submitService from "../commonServices/submitService.js";
import fs from "fs"; 
async function customRun(req, res, next) { 
    const userId = req.session.userId; 
    if(userId === undefined) { 
        return res.status(400).send({msg: "User not logged in"});
    }
    if(req.files === undefined || req.files === null || req.files.length < 3) { 
        return res.status(500).send({msg: "Internal Server Error"}); 
    }

    console.log("Passed validation"); 
    
    const judgeUrl = req.files['judgeFile'][0].path; 
    const sourceUrl1 = req.files['sourceFile1'][0].path; 
    const sourceUrl2 = req.files['sourceFile2'][0].path; 

    try { 
        const {winner, logUrl} = await submitService.submit(judgeUrl, sourceUrl1, sourceUrl2); 
        console.log(logUrl)
        assert(fs.existsSync(logUrl)); 
        return res.status(200).sendFile(logUrl); 
    } catch(err) { 
        console.log("customRun Controller: Error" + err)
        return res.status(500).send({msg: "Internal Server Error"}); 
    }
}

const customRunController = { 
    customRun
}

export default customRunController; 