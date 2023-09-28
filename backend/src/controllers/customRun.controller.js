import submitService from "../judgeService/submitService.js";
import BadRequestError from "./errors/BadRequestError.js";

async function customRun(req, res, next) { 
    const userId = req.session.userId; 

    // ALLOWS non-users to submit an invocation as well 
    // This might risk bots spamming requests, but I will think 
    // about it later
    // if(userId == null) { 
    //     throw new BadRequestError("User not logged in"); 
    // }
    
    if(!req.files['judgeFile'] || !req.files['sourceFile1'] || !req.files['sourceFile2']) { 
        throw new BadRequestError("At least one of three required files missing"); 
    }
    
    const judgeUrl = req.files['judgeFile'][0].path; 
    const sourceUrl1 = req.files['sourceFile1'][0].path; 
    const sourceUrl2 = req.files['sourceFile2'][0].path; 

    const {logUrl} = await submitService.submit(judgeUrl, sourceUrl1, sourceUrl2); 

    return res.status(200).sendFile(logUrl); 
}

const customRunController = { 
    customRun
}

export default customRunController; 