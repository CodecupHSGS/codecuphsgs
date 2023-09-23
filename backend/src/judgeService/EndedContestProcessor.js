'use strict'; 

import submitService from "./submitService.js";

export default class EndedContestProcessor { 
    /**
     * A class to process unjudged contests, taking into account that sometimes the results 
     * of previous matches are need to decide new matches. 
     */
    #contestStateMachine; 

    constructor(contestStateMachine) { 
        this.#contestStateMachine = contestStateMachine; 
    }

    /**
     * Function to process a contest. The contest can be seperated into several rounds. The processor 
     * maintain a loop of waiting for new matches from the state machine while feeding it the results 
     * of the previous matches
     */
    async process() { 
        console.log("Contest processor processing contest")

        // Wait for the contest state machine to fetch from database
        // and finish initialization
        await this.#contestStateMachine.init(); 


        const promises = []; 
        while(true) { 
            // Hold until there is a new match
            const nextMatch = await this.#contestStateMachine.yieldNextUnjudgedMatch(); 
            console.log("StateMachine yielded next match: " + nextMatch); 

            // There is no new match
            if(nextMatch === null) { 
                break; 
            }

            // Submit the new match and call the handler when the result is returned. 
            const {judgeUrl, sourceUrl1, sourceUrl2, handleResult} = nextMatch; 
            promises.push(this.#submit(judgeUrl, sourceUrl1, sourceUrl2, handleResult)); 

            // await this.#submit(judgeUrl, sourceUrl1, sourceUrl2, handleResult)
        }

        // End this function when all the results have been handled by the state machine. 
        try {
            await Promise.all(promises); 
        } catch(e) { 
            console.error("Waiting for all promises does not work. " + e); 
        } 

        // Let the stateMachine clean up
        await this.#contestStateMachine.cleanUp(); 
    }

    /**
     * Function to submit the codes and call the handler when the result come back. 
     * Waits for the state machine to finish handling the result. 
     */
    async #submit(judgeUrl, sourceUrl1, sourceUrl2, handleResult) { 
        // Hold until there is result for the match. In the mean time, the main loop can fetching new matches
        // from the state machine
        const result = await submitService.submit(judgeUrl, sourceUrl1, sourceUrl2);

        // After the result came back, wait for the state machine to handle this result. 
        await handleResult(result); 
    }
}