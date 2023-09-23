'use strict';
// import 

const TIME_DELTA = 10;

async function start() { 
    await handleEndedUnjudgedContestsFromDB(); 
}

function subscribe(contest) { 
    setTimeout(() => { 
        handleEndedUnjudgedContest(contest); 
    }, TIME_DELTA + (contest.endDate - new Date())); 
}

async function handleEndedUnjudgedContestsFromDB() { 
    const contests = await contestService.getAllEndedUnjudgedContest(); 

    for(const contest of contests) { 
        await handleEndedUnjudgedContest(contest); 
    }
}

async function handleEndedUnjudgedContest(contest) {  
    console.log("Handling contest: ")
    console.log(contest); 

    const endedContestProcessor = new EndedContestProcessor(
        stateMachineFactory.getStateMachine(contest), 
    )
    checkHasEnded(contest); 
    checkUnjudged(contest); 

    await endedContestProcessor.process(contest); 
}

function checkHasEnded(contest) { 
    const currentDate = new Date().toISOString(); 
    if(contest.endDate > currentDate) { 
        throw new Error("Contest has not ended. End date: " + contest.endDate + ". Current date: " + currentDate); 
    }
}

function checkUnjudged(contest) { 
    if(contest.judged === true) { 
        throw new Error("contest has been judged"); 
    }
}

const contestPostEndingProcessor = { 
    start, 
    subscribe
}

export default contestPostEndingProcessor; 