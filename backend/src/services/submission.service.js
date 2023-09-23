import SubmissionModel from "../models/submission.model.js";
import ServiceError from "./errors/serviceError.js";
import UnknownInternalError from "./errors/unknownInternalError.js";

async function getSubmission({id}) { 
    console.log("Contest Service: Fetching data for submission #" +  id); 
    const submissionDocument = await SubmissionModel.findOne({id}); 
    console.log("Contest Service: Data for submission #" + id); 
    console.log(submissionDocument); 
    return submissionDocument.toObject(); 
}

async function createSubmission({contestId, userId, sourceUrl}) { 
    // validate inputs
    if(isNaN(contestId)) { 
        throw new ServiceError("contestId (" + contestId + ") is not a number"); 
    }
    if(isNaN(userId)) { 
        throw new ServiceError("userId is not a number"); 
    }
    if(typeof sourceUrl != "string") { 
        throw new ServiceError("sourceUrl is not a string"); 
    }

    try {
        const submissionId = await SubmissionModel.count() + 1; 
        const submissionDocument = await SubmissionModel.create({
            id: submissionId, 
            contestId, 
            userId, 
            sourceUrl
        }); 

        return submissionDocument.toObject();  
    } 
    catch(err) { 
        ("Error at createSubmissionService: " + err); 

        // if(err instanceof MongooseError) { 
        //     throw new DatabaseError("Database error"); 
        // }
        // else { 
            throw new UnknownInternalError(); 
        // }
    }
}

const submissionService = { 
    getSubmission, 
    createSubmission
}

export default submissionService; 