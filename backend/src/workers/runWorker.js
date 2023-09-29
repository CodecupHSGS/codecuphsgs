import AllVsAllStateMachine from "../judgeService/contest_state_machine/all_vs_all.js"
import EndedContestProcessor from "../judgeService/EndedContestProcessor.js"
import RunModel from "../models/run.model.js";
import centralEventEmitter from "../pubsub/centralEventEmitter.js";

const TIME_DELTA = 10;

async function processRun(runId) { 
    try { 
        console.log("Processing run #" + runId)

        const endedContestProcessor = new EndedContestProcessor(
            new AllVsAllStateMachine(runId)
        ); 

        await endedContestProcessor.process(); 
    } catch(err) { 
        console.error("Failed to process run #" + runId); 
        console.error(err); 
    }
}

function handleNewRun(runId) { 
    processRun(runId); 
}

async function processUnfinishedRuns() { 
    try { 
        const runs = await RunModel.find({finishedJudging: false}); 

        for(const run of runs) { 
            await processRun(run.id); 
        }
    } catch(err) { 
        console.error("Failed to finish unfinished runs"); 
        console.error(err); 
    }
}

// When setting up the worker, fetch all unfinished runs and starts processing them
processUnfinishedRuns(); 

// Subscribe to new runs
centralEventEmitter.on("new_run", handleNewRun); 