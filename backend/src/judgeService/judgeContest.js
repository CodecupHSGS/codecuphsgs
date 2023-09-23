import EndedContestProcessor from "./EndedContestProcessor.js";
import ContestModel from "../models/contest.model.js";
import stateMachineFactory from "./contest_state_machine/factory.js";
import ValidationError from "../services/errors/validationError.js";

export default async function judgeContest({
    contestId, 
    includeUnofficial
}) {  
    console.log("Handling contest #" + contestId)

    const contestDocument = await ContestModel.findOne({id: contestId}); 

    console.log("Done finding")

    if(!contestDocument) { 
        throw new Error("Contest not found at judgeService.judgeContest"); 
    }

    const endedContestProcessor = new EndedContestProcessor(
        stateMachineFactory.getStateMachine({
            contestId, 
            contestFormat: contestDocument.contestFormat, 
            includeUnofficial
        }), 
    )

    await endedContestProcessor.process(); 
}