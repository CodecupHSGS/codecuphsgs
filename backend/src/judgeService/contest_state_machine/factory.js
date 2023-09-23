import AllVsAllStateMachine from "./all_vs_all.js";

function getStateMachine({
    contestId, 
    contestFormat, 
    includeUnofficial
}) { 

    console.log("State machine factory getting state machine for contest: " + contestId)

    if(contestFormat === "all-vs-all") { 
        return new AllVsAllStateMachine({ 
            runId: null, 
            contestOptions: { 
                contestId, 
                includeUnofficial
            }
        }); 
    }
    else { 
        throw new Error("No state machine available")
    }
}

const stateMachineFactory = { 
    getStateMachine
}

export default stateMachineFactory; 