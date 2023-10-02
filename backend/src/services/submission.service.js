import fs from "fs"; 

import ContestModel from "../models/contest.model.js";
import SubmissionModel, { getNextSubmissionId } from "../models/submission.model.js";
import UserModel from "../models/user.model.js";

import ConflictError from "./errors/conflictError.js";
import ValidationError from "./errors/validationError.js";

async function getSubmission({submissionId}) { 
    if(typeof submissionId != "number") { 
        throw new ValidationError("Submission id is not a number"); 
    }
    
    const submissionDocument = await SubmissionModel.findOne({id: submissionId}); 

    if(!submissionDocument) { 
         throw new ConflictError("No submission with such id");
    }

    return submissionDocument.toObject(); 
}

async function createSubmission({contestId, userId, sourceUrl}) { 
    // validate inputs
    if(typeof contestId !== "number" || typeof userId !== "number" || typeof sourceUrl !== "string") { 
        throw new ValidationError("Missing or wrong parameter type"); 
    }
    if(!fs.existsSync(sourceUrl)) { 
        throw new ValidationError("Source file does not exist at provided path"); 
    }

    if(!FileSystem.exis)

    if(!(await UserModel.findOne({id: userId}))) { 
        throw new ConflictError("No user with such userId"); 
    }

    if(!(await ContestModel.findOne({id: contestId}))) { 
        throw new ConflictError("No contest with such contestId"); 
    }

    const submissionId = await getNextSubmissionId(); 
    const submissionDocument = await SubmissionModel.create({
        id: submissionId, 
        contestId, 
        userId, 
        sourceUrl
    }); 

    return submissionDocument.toObject();  
}

const submissionService = {  
    createSubmission, 
    getSubmission
}

export default submissionService; 