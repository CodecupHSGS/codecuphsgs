import ContestModel from "../models/contest.model.js";
import submissionService from "../services/submission.service.js" 
import ServiceError from "./errors/serviceError.js";
import ValidationError from "./errors/validationError.js";
import DatabaseError from "./errors/databaseError.js";
import UnknownInternalError from "./errors/unknownInternalError.js";
import SubmissionModel from "../models/submission.model.js";
import UserModel from "../models/user.model.js";

async function getAllEndedUnjudgedContest() { 
    return Array.from(
            await ContestModel.find({judged: false, endDate: {$lte: new Date().toISOString()}})
        ).map(contestDocument => contestDocument.toObject()); 
}

/*
    returns array of all contests in the database. 
*/
async function getAllContests() { 
    return Array.from(await ContestModel.find())
        .map(contestDocument => contestDocument.toObject()); 
}

/*
    return {success: boolean, error: undefined | string, insertedContest: undefined | object}
*/
async function createContest(contest) {
    console.log("gameId: ")
    console.log(contest.gameId); 

    let reformattedContest = {
        id: await ContestModel.count() + 1, 
        name: contest.name, 
        startDate: contest.startDate, 
        endDate: contest.endDate, 
        gameId: contest.gameId, 
        runTrialMatches: contest.runTrialMatches, 
        judgeMode: contest.judgeMode, 
        contestFormat: contest.contestFormat
    }
    
    if(contest.judged != undefined) { 
        console.warn("Contest is marked as judged / unjudged!!!!"); 
        reformattedContest.judged = contest.judged; 
    }

    try {
        let insertedContest = await ContestModel.create(reformattedContest); 
        return insertedContest; 
    } catch (e) { 
        console.log("Error at creating contest service: " + e); 
        throw new Error("Failed at creating contest service"); 
    }
}

async function getContest(contestId) { 
    const contestDocument = await ContestModel.findOne({id: contestId});
    return contestDocument.toObject(); 
}

async function deleteContest(contestId) { 
    let contestFoundCount = await ContestModel.count({id: contestId})
    assert( contestFoundCount <= 1); 
    if(contestFoundCount == 0) { 
        return res.status(409).send({msg:"No contest found"}); 
    }

    let {acknowledged, deletedCount} = await contestModel.deleteMany({id: contestId}); 
    assert(deletedCount == 1); 
}

async function isContestActive(contestId) { 
    const contestDocument = await ContestModel.findOne({id: contestId}); 
    const currentDate = new Date().toISOString(); 
    if(contestDocument.endDate < currentDate || contestDocument.startDate > currentDate) { 
        return false; 
    }
    return true; 
} 

async function createSubmission({
    contestId, 
    userId, 
    sourceUrl
}) { 
    if(isNaN(contestId)) { 
        throw new ServiceError("Contest Id is not a number"); 
    }

    if(isNaN(userId)) { 
        throw new ServiceError("UserId is not a number"); 
    }

    if(typeof sourceUrl != "string") { 
        console.error("sourceUrl: " + sourceUrl)
        throw new ServiceError("soureUrl is not a string"); 
    }

    if(!isContestActive(contestId)) { 
        throw new ValidationError("Invalid request: contest is not active"); 
    }

    try { 
        const insertedSubmission = await submissionService.createSubmission({
            contestId, 
            userId, 
            sourceUrl
        }); 

        await setFinalSubmission({contestId, userId, submissionId: insertedSubmission.id}); 

        return insertedSubmission; 
    } 
    catch(err) {
        console.error("Error at createSubmission service: " + err); 
        // if(err instanceof MongooseError) { 
        //     throw new DatabaseError("Database error"); 
        // }
        // else { 
            throw new UnknownInternalError(); 
        // }
    }
}

async function getFinalSubmission(contestId, userId) { 
    const contestDocument = await ContestModel.findOne({id: contestId});
    return contestDocument.finalSubmissions.get((userId).toString()); 
}

async function setFinalSubmission({contestId, userId, submissionId}) { 
    try {
        await ContestModel.updateOne(
            {id: submissionId, userId: userId, contestId: contestId}, 
            { $set: {[`finalSubmissions.${userId}`]: submissionId}}); // finalSumissions.11 = finalSubmissions["11"]? 
        console.warn("This syntax still needs investigation"); 
        return true; 
    } catch(e) { 
        console.error(e); 
        return false; 
    }
}

async function getContestResults(contestId) { 
    console.log(contestId); 
    const contest = await ContestModel.findOne({id: contestId}); 
    return {
        result: contest.result, 
        startedJudging: contest.startedJudging, 
        finishedJudging: contest.finishedJudging
    }; 
}

async function setContestResults(contestId, result) { 
    try {
        const contest = await ContestModel.findOne({id: contestId})
        contest.result = result; 
        await contest.save(); 
    } catch(e) { 
        console.error(e); 
        return false; 
    }
}

async function getCurrentState(contestId) { 
    const contestDocument = await ContestModel.findOne({id: contestId}); 
    return contestDocument.currentState; 
}

async function setCurrentState(contestId, currentStateString) { 
    await ContestModel.updateOne({id: contestId}, {currentState: currentStateString}); 
}

async function getSubmissionsWithUsername({contestId, includeUnofficial}) { 
    let submissions; 
    if(includeUnofficial === true) {
        submissions = await SubmissionModel.find({contestId}); 
    }
    else { 
        console.log("exclude unofficial: true")
        submissions = await SubmissionModel.find({contestId, official: true}); 
    }
    const filteredSubmissions = await Promise.all(submissions.map(async (submission) => { 
        // console.log(await UserModel.findOne({id: submission.userId}))
        const username = (await UserModel.findOne({id: submission.userId})).username; 
        // console.log(username); 
        return { 
            submissionId: submission.id, 
            contestId: submission.contestId, 
            userId: submission.userId, 
            submissionDate: submission.submissionDate, 
            username
        }
    }))
    return filteredSubmissions; 
}

const contestService = { 
    getAllEndedUnjudgedContest, 
    getAllContests, 
    createContest, 
    getContest, 
    deleteContest, 
    isContestActive, 
    createSubmission, 
    getFinalSubmission, 
    setFinalSubmission, 
    getContestResults, 
    setContestResults, 
    getCurrentState, 
    setCurrentState, 
    getSubmissionsWithUsername, 
}

export default contestService; 