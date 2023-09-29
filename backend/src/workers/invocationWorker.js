import centralEventEmitter from "../pubsub/centralEventEmitter.js";
import submitService from "../judgeService/submitService.js";
import InvocationModel from "../models/invocation.model.js";
import MatchModel from "../models/match.model.js";
import SubmissionModel from "../models/submission.model.js";
import ContestModel from "../models/contest.model.js";
import GameModel from "../models/game.model.js";

async function asynchandleNewInvocation(invocationId) { 
    try { 
        const invocationDocument = await InvocationModel.findOne({id: invocationId}); 
        
        const matchId = invocationDocument.matchId; 
        const matchDocument = await MatchModel.findOne({id: matchId}); 

        const contestId = matchDocument.contestId;
        const contestDocument = await ContestModel.findOne({id: contestId}); 

        const gameId = contestDocument.gameId; 
        const gameDocument = await GameModel.findOne({id: gameId}); 
        
        const submission1Id = matchDocument.submission1Id; 
        const submission2Id = matchDocument.submission2Id; 
        const submission1Document = await SubmissionModel.findOne({id: submission1Id}); 
        const submission2Document = await SubmissionModel.findOne({id: submission2Id}); 

        const judgeUrl = gameDocument.judgeUrl; 
        const sourceUrl1 = submission1Document.sourceUrl; 
        const sourceUrl2 = submission2Document.sourceUrl; 

        const {firstPlayerWin, logUrl} = await submitService.submit(judgeUrl, sourceUrl1, sourceUrl2); 
        const winner = firstPlayerWin? submission1Id: submission2Id; 

        await MatchModel.updateOne({id: matchId}, {judgedDate: new Date(), finishedJudging: true, winner, logUrl}); 
    } catch(err) { 
        console.error("failed to handle new invocation (#" + invocationId + ")#"); 
        console.error(err); 
    }
}

centralEventEmitter.on("new_invocation", (invocationId) => { 
    asynchandleNewInvocation(invocationId)
}); 