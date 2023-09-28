import contestService from "../services/contest.service.js";

import BadRequestError from "./errors/BadRequestError.js";
import UnauthorisedError from "./errors/UnauthorisedError.js";

import { contestRestrictedView } from "../views/contest.js"; 
import { submissionRestrictedView } from "../views/submission.js"; 

import {isStringBoolean, stringToBoolean} from "./utils/stringBoolean.js"

import centralEventEmitter from "../pubsub/centralEventEmitter.js"; 

async function getAllContests(req, res, next) { 
    let contests = await contestService.getAllContests(); 
    
    if(!req.session.isAdmin) { 
        contests = contests.map(contestRestrictedView); 
    }

    return res.status(200).send({
        msg: "Successful", 
        contests
    }); 
}

async function createContest(req, res, next) { 
    const {name, 
        gameId, 
    } = req.body; 

    const startDateString = req.body.startDate; 
    const endDateString = req.body.endDate; 
    const startDate = new Date(startDateString); 
    const endDate = new Date(endDateString); 

    if(typeof name !== "string" 
        || typeof gameId !== "number"
        || isNaN(startDate)
        || isNaN(endDate)) {  
        
        throw new BadRequestError("Missing or wrong parameter type"); 
    }

    if(!req.session.isAdmin) { 
        throw new UnauthorisedError("User is not admin"); 
    }
    
    await contestService.createContest({
        name, 
        gameId,
        startDate,  
        endDate, 
    });

    return res.status(200).send({msg: "Created"}); 
}

async function getContest(req, res, next) { 
    const contestIdString = req.params.contestId; // bug: params, not param
    
    if(isNaN(contestIdString)) { 
        throw new BadRequestError("Missing or wrong parameter type for contestId"); 
    }

    const contestId = parseInt(contestIdString); 

    let contest = await contestService.getContest({contestId}); 

    if(!req.session.isAdmin) { 
        contest = contestRestrictedView(contest); 
    }

    return res.status(200).send({
        msg: "Successful", 
        contest
    }); 
}

/**
 * CURRENTLY NOT SUPPORTED
 */
// async function deleteContest(req, res, next) { 
//     let contestId = req.query.contestId; 

//     if(contestId == null) { 
//         throw new BadRequestError(msg: "Missing contestId"); 
//     }

//     if(!req.session.isAdmin) { 
//         throw new UnauthorisedError("User is not admin")
//     }
    
//     await contestService.deleteContest(contestId)
    
//     return res.status(200).send({msg: "deleted"}); 
// }

async function createSubmission(req, res, next) { 
    const userId = req.session.userId; 
    const contestIdString = req.params.contestId
    const isOfficialString = req.body.isOfficial; 

    if(!isStringBoolean(isOfficialString) || isNaN(contestIdString) ) { 
        throw new BadRequestError("Missing parameter or wrong type of parameters"); 
    }

    if(userId == null) { 
        throw new UnauthorisedError("Not logged in"); 
    }

    const isOfficial = stringToBoolean(isOfficialString); 
    const contestId = parseInt(contestIdString); 
    const sourceUrl = req.file.path; 

    // Admins cannot submit officially. 
    if(isOfficial === true && req.session.isAdmin === true) { 
        throw new UnauthorisedError("Admins cannot submit officially"); 
    }

    let submission = await contestService.createSubmission({ 
        contestId, 
        userId, 
        sourceUrl, 
        isOfficial
    }); 

    if(!req.session.isAdmin) { 
        submission = submissionRestrictedView(submission); 
    }

    return res.status(200).send({
        submission, 
        msg: "submitted"
    }); 
}

async function getSubmissions(req, res, next) { 
    const userId = req.session.userId; 
    const contestIdString = req.params.contestId; 
    const includeUnofficialString = req.query.includeUnofficial; 
    const myOnly = req.query.myOnly; 

    if(isNaN(contestIdString) 
        || !isStringBoolean(includeUnofficialString)) { 
        throw new BadRequestError("Missing or wrong type of parameters"); 
    }

    if(myOnly === "on" && userId == null) { 
        throw new BadRequestError("User not logged in; cannot use myOnly filter"); 
    }

    const contestId = parseInt(contestIdString); 
    const includeUnofficial = stringToBoolean(includeUnofficialString); 

    let filterFunc = null; 
    if(myOnly === "on") { 
        filterFunc = (submission) => submission.userId === userId; 
    }

    let mapFunc = null; 
    if(!req.session.isAdmin) { 
        mapFunc = submissionRestrictedView; 
    }

    const submissions = await contestService.getSubmissionsWithUsername({contestId, includeUnofficial, mapFunc, filterFunc}); 

    return res.status(200).send({submissions}); 
}

async function getContestResults(req, res, next) { 
    const contestIdString = req.params.contestId; 
    const includeUnofficialString = req.query.includeUnofficial; 

    if(isNaN(contestIdString)) { 
        throw new BadRequestError("Missing or wrong type of contest id"); 
    }

    if(!isStringBoolean(includeUnofficialString)) { 
        throw new BadRequestError("Missing or wrong type of includeUnofficial"); 
    }

    const contestId = parseInt(contestIdString); 
    const includeUnofficial = stringToBoolean(includeUnofficialString); 

    const results = await contestService.getContestResults({contestId, includeUnofficial}); 
    return res.status(200).send({results}); 
}

async function createRun(req, res, next) { 
    const contestIdString = req.params.contestId; 
    const includeUnofficialString = req.query.includeUnofficial; 

    if(isNaN(contestIdString)) { 
        throw new BadRequestError("Missing or wrong type of contest id"); 
    }

    if(!isStringBoolean(includeUnofficialString)) { 
        throw new BadRequestError("Missing or wrong type of includeUnofficial"); 
    }
    
    const contestId = parseInt(contestIdString); 
    const includeUnofficial = stringToBoolean(includeUnofficialString); 


    const run = await contestService.createRun({
        contestId, 
        includeUnofficial,
    }); 

    // Announcing to subscribing workers
    centralEventEmitter.emit("new_run", run.id);  
    
    return res.status(200).send({msg: "Run created"}); 
}

async function invoke(req, res, next) { 
    const userId = req.session.userId; 

    const contestIdString = req.params.contestId; 
    const submission1IdString = req.body.submission1Id; 
    const submission2IdString = req.body.submission2Id; 

    if(isNaN(contestIdString)
        || isNaN(submission1IdString)
        || isNaN(submission2IdString)) {

        throw new BadRequestError("Parameters missing or of wrong type"); 
    }

    if(userId == null) { 
        throw new UnauthorisedError("User not logged in"); 
    }

    const invocation = await contestService.runInvocation({
        userId,
        contestId: parseInt(contestIdString), 
        submission1Id: parseInt(submission1IdString), 
        submission2Id: parseInt(submission2IdString), 
    }); 

    // Announce to the invocation worker
    centralEventEmitter.emit("new_invocation", invocation.id); 

    return res.status(200).send({msg: "Initiated invocation"}); 
}

async function getAllInvocations(req, res, next)  { 
    const userId = req.session.userId; 
    const contestIdString = req.params.contestId; 

    if(isNaN(contestIdString)) { 
        throw new BadRequestError("contestId is not a number");
    }

    // either null or undefined
    if(userId == null) { 
        throw new UnauthorisedError("User not logged in"); 
    }

    const contestId = parseInt(contestIdString); 

    const invocationsWithResults = await contestService.getAllInvocationsWithResults({ 
        contestId, 
        userId
    }); 

    return res.status(200).send({invocations: invocationsWithResults}); 
}

async function getLogForInvocation(req, res, next) { 
    const userId = req.session.userId; 

    if(userId == null) { 
        throw new UnauthorisedError("User not logged in"); 
    }

    const invocationIdString = req.query.invocationId; 
    if(isNaN(invocationIdString)) { 
        throw new BadRequestError("Missing or wrong type of invocationId");
    }

    const invocationId = parseInt(invocationIdString); 

    const logUrl = await contestService.getLogForInvocation({userId, invocationId});

    res.status(200).download(logUrl); 
}

const contestController = { 
    createContest, 
    getAllContests, 
    getContest, 
    // deleteContest, 
    createSubmission, 
    getContestResults, 
    getSubmissions, 
    createRun, 
    invoke, 
    getAllInvocations, 
    getLogForInvocation
}

export default contestController; 