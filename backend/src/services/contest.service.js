import ContestModel from "../models/contest.model.js";
import SubmissionModel from "../models/submission.model.js";
import UserModel from "../models/user.model.js";
import RunModel from "../models/run.model.js"; 
import InvocationModel from "../models/invocation.model.js"; 
import MatchModel from "../models/match.model.js"; 

import ServiceError from "./errors/serviceError.js";
import ValidationError from "./errors/validationError.js";
import UnknownInternalError from "./errors/unknownInternalError.js";
import ConflictError from "./errors/conflictError.js";
import GameModel from "../models/game.model.js";

// HELPER FUNCTIONS
async function doesContestExist(contestId) { 
    const contestDocument = await ContestModel.findOne({id: contestId}); 

    return contestDocument != null; 
}

async function isContestActive(contestId) { 
    const contestDocument = await ContestModel.findOne({id: contestId}); 
    const currentDate = new Date();
    const startDate = new Date(contestDocument.startDate); 
    const endDate = new Date(contestDocument.endDate);  

    return startDate.getTime() <= currentDate.getTime() && currentDate.getTime() <= endDate.getTime(); 
} 
/**
 * Set a submission as the user's final submission of the set of both officiall and unofficiall submissions
 */
async function setFinalSubmission({contestId, userId, submissionId}) { 
    await ContestModel.updateOne(
        {id: contestId}, 
        {$set: {[`finalSubmissions.${userId}`]: submissionId}}); // finalSumissions.11 = finalSubmissions["11"]? 
}

/**
 * Set a submission as the user's final official submission
 */
async function setFinalOfficialSubmission({contestId, userId, submissionId}) { 
    await ContestModel.updateOne(
        {id: contestId}, 
        {$set: {[`finalOfficialSubmissions.${userId}`]: submissionId}}); // finalSumissions.11 = finalSubmissions["11"]? 
}

// SERVICES
/*
    Returns array of all contests in the database. 
*/
async function getAllContests() { 
    return Array.from(await ContestModel.find())
        .map(contestDocument => contestDocument.toObject()); 
}

/*
    Create a new contest
*/
async function createContest({name, gameId, startDate, endDate}) {
    if(typeof name !== "string" 
        || typeof gameId !== "number" 
        || !startDate instanceof Date 
        || isNaN(startDate)
        || !endDate instanceof Date
        || isNaN(endDate)) {  
        throw new ValidationError("Missing or wrong parameter type"); 
    }

    if(!(await GameModel.findOne({id: gameId}))) { 
        throw new ConflictError("No game with such gameId exist"); 
    }

    const reformattedContest = {
        id: await ContestModel.count() + 1, 
        name, 
        startDate, 
        endDate, 
        gameId, 
    }

    const insertedContest = await ContestModel.create(reformattedContest); 

    return insertedContest; 
}

/**
 * Get data of a contest
 */
async function getContest({contestId}) { 
    if(typeof contestId !== "number") { 
        throw new ValidationError("Missing or wrong parameter type"); 
    }
    
    const contestDocument = await ContestModel.findOne({id: contestId});
    
    if(!contestDocument) { 
        throw new ConflictError("No contest with such id"); 
    }

    return contestDocument.toObject(); 
}

/**
 * TEMPORARILY NOT SUPPORTED
 */
// async function deleteContest({contestId}) { 
//     const contestFoundCount = await ContestModel.count({id: contestId})

//     assert( contestFoundCount <= 1); 
//     if(contestFoundCount == 0) { 
//         return res.status(409).send({msg:"No contest found"}); 
//     }

//     let {acknowledged, deletedCount} = await contestModel.deleteMany({id: contestId}); 
//     assert(deletedCount == 1); 
// }

async function createSubmission({
    contestId, 
    userId, 
    sourceUrl,
    isOfficial, 
}) { 
    // Salidating argument types
    if(typeof contestId !== "number" || typeof userId !== "number" 
        || typeof isOfficial !== "boolean" || typeof sourceUrl !== "string") { 
        throw new ValidationError("Missing parameters or wrong parameter types"); 
    }

    if(!(await doesContestExist(contestId))) { 
        throw new ConflictError("No contests with such id exist"); 
    }

    // Checking if the contest is active for official submissions
    if(isOfficial && (await isContestActive(contestId)) !== true) { 
        throw new ConflictError("Cannot submit officially when contest is not active"); 
    }

    const insertedSubmission = await SubmissionModel.create({
        id: await SubmissionModel.count({}) + 1, 
        contestId, 
        userId, 
        sourceUrl, 
        isOfficial
    }); 

    if(isOfficial) { 
        await setFinalOfficialSubmission({contestId, userId, submissionId: insertedSubmission.id}); 
        await setFinalSubmission({contestId, userId, submissionId: insertedSubmission.id}); 
    }
    else { 
        await setFinalSubmission({contestId, userId, submissionId: insertedSubmission.id}); 
    }

    return insertedSubmission.toObject(); 
}

/**
 * Get result of the last run of this contest
 */

async function getSubmissionsWithUsername({contestId, includeUnofficial, mapFunc, filterFunc}) { 
    if(typeof contestId !== "number" || typeof includeUnofficial !== "boolean") { 
        throw new ValidationError("Wrong or missing parameter types")
    }

    if(!(await doesContestExist(contestId))) {
        throw new ConflictError("No contest with such id exist"); 
    }

    let submissionDocuments; 
    if(includeUnofficial === true) {
        submissionDocuments = await SubmissionModel.find({contestId}); 
    }
    else { 
        submissionDocuments = await SubmissionModel.find({contestId, isOfficial: true}); 
    }

    let submissions = submissionDocuments.map(submission => submission.toObject()); 

    if(filterFunc) { 
        submissions = submissions.filter(filterFunc); 
    }

    if(mapFunc) { 
        submissions = submissions.map(mapFunc); 
    }

    console.log(submissions); 

    const submissionsWithUsername = await Promise.all(submissions.map(async (submission) => { 
        const username = (await UserModel.findOne({id: submission.userId})).username; 
        return { 
            ...submission, 
            submissionId: submission.id, 
            username
        }
    }))

    return submissionsWithUsername; 
}

async function createRun({ contestId, includeUnofficial }) { 
    if(typeof contestId !== "number" || typeof includeUnofficial != "boolean") {
        throw new ValidationError("Wrong or missing parameter types")
    }

    if(!(await doesContestExist(contestId))) {
        throw new ConflictError("No contest with such id exist"); 
    }

    const runId = (await RunModel.count({})) + 1;
    const runDocument = await RunModel.create({
        id: runId, 
        contestId, 
        includeUnofficial
    })  

    return runDocument.toObject(); 
}

async function getContestResults({contestId, includeUnofficial}) { 
    if(typeof contestId !== "number" || typeof includeUnofficial !== "boolean") { 
        throw new ValidationError("Wrong or missing parameter types")
    }

    if(!(await doesContestExist(contestId))) {
        throw new ConflictError("No contest with such id exist"); 
    }

    const runDocuments = await RunModel.find({contestId, includeUnofficial}).sort({createdDate: -1}).limit(1);
    
    if(runDocuments.length === 0) { 
        return { 
            startedJudging: false, 
            finishedJudging: false, 
        }
    }

    console.log(runDocuments.length); 

    const lastRun = runDocuments[0].toObject(); 
    return {
        ...JSON.parse(lastRun.results), 
        startedJudging: true, 
        finishedJudging: lastRun.finishedJudging, 
        runCreatedDate: lastRun.createdDate
    }; 
}

async function runInvocation({
    userId, 
    contestId, 
    submission1Id, 
    submission2Id, 
}) { 
    if(typeof userId !== "number" 
        || typeof contestId !== "number" 
        || typeof submission1Id !== "number" 
        || typeof submission2Id !== "number") { 
        throw new ValidationError("userId is not a number"); 
    }

    const submission1Document = await SubmissionModel.findOne({id: submission1Id}); 
    const submission2Document = await SubmissionModel.findOne({id: submission2Id}); 
    
    if(!submission1Document || !submission2Document) { 
        throw new ConflictError("At least one submission not found"); 
    }
    if(submission1Document.contestId !== contestId || submission2Document.contestId !== contestId) { 
        throw new ConflictError("Contest ID and submission does not match"); 
    }
    if(userId !== submission1Document.userId && userId !== submission2Document.userId) { 
        throw new ConflictError("Both submissions are not the user's"); 
    }

    const matchId = await MatchModel.count({}) + 1; 

    const matchDocument = await MatchModel.create({
        id: matchId, 
        contestId, 
        submission1Id, 
        submission2Id, 
    })

    const invocationId = await InvocationModel.count({}) + 1; 

    const invocationDocument = await InvocationModel.create({
        id: invocationId, 
        userId, 
        matchId, 
        contestId
    })

    if(!matchDocument || !invocationDocument) { 
        console.error("runInvocation Service: Unknown error, cannot create documents"); 
        throw new UnknownInternalError(); 
    }

    return invocationDocument.toObject(); 
}

async function getAllInvocationsWithResults({userId, contestId}) { 
    if(typeof userId !== "number") { 
        throw new ValidationError("userId is NaN"); 
    }
    if(typeof contestId !== "number") { 
        throw new ValidationError("contestId is NaN"); 
    }

    if((await doesContestExist(contestId)) !== true) { 
        throw new ConflictError("No contest with such id exists"); 
    }

    const invocationsDocuments = await InvocationModel.find({userId, contestId}); 

    const invocationsPromises = invocationsDocuments.map(async(invocationDocument) => { 
        const matchDocument = await MatchModel.findOne({id: invocationDocument.matchId}); 
        const {finishedJudging, winner, submission1Id, submission2Id} = matchDocument.toObject(); 
        return { 
            ...invocationDocument.toObject(), 
            submission1Id,
            submission2Id,  
            finishedJudging, 
            winner
        }
    });  
    const invocations = await Promise.all(invocationsPromises); 
    return invocations; 
}

async function getLogForInvocation({
    userId, 
    invocationId, 
}) { 
    if(typeof userId !== "number" || typeof invocationId !== "number") { 
        throw new ValidationError("Wrong argument type"); 
    } 

    const invocationDocument = await InvocationModel.findOne({id: invocationId}); 
    if(invocationDocument.userId !== userId) { 
        throw new ConflictError("User ID and invocation's owner does not match"); 
    }

    const matchId = invocationDocument.matchId;
    const matchDocument = await MatchModel.findOne({id: matchId}); 
    if(matchDocument.finishedJudging !== true) { 
        throw new ConflictError("Invocation has not been judged"); 
    }
    const logUrl = matchDocument.logUrl; 

    return logUrl; 
}

const contestService = { 
    getAllContests, 
    createContest, 
    getContest, 
    // deleteContest, 
    isContestActive, 
    createSubmission, 
    setFinalSubmission, 
    getSubmissionsWithUsername, 
    setFinalOfficialSubmission, 
    getContestResults, 
    createRun, 
    runInvocation, 
    getAllInvocationsWithResults, 
    getLogForInvocation
}

export default contestService; 