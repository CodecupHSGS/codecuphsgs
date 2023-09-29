import RunModel from "../../models/run.model.js";
import ContestModel from "../../models/contest.model.js";
import SubmissionModel from "../../models/submission.model.js";
import GameModel from "../../models/game.model.js"
import assert from "assert";

export default class AllVsAllStateMachine { 
    /**
     * A state machine for all-vs-all contests, which is able to cache and resume unfinished runs in the database 
     */
    #contestId; 
    #runId; 
    #cache; 
    #results;   

    constructor(runId) { 
        assert(typeof runId === "number");  
        this.#runId = runId; 
    }

    /**
     * Fetch data from the database to initialize the state machine. 
     * Fetch a previously cached run to continue that run if needed. 
     */
    async init() { 
        console.log("StateMachine initializing"); 

        const runDocument = await RunModel.findOne({id: this.#runId}); 
        this.#contestId = runDocument.contestId; 

        try { 
            this.#cache = JSON.parse(runDocument.cache);
            this.#results = JSON.parse(runDocument.results);  
        } catch(err) { 
            console.error("StateMachine: Parsing old data failed" + runDocument.cache + "\n" + runDocument.results); 
            // invalid old data. reset everthing
            this.#cache = {}; 
            this.#results = {}; 
        }
        
        if(this.#cache.initialized !== undefined) {
            // Continuing an old run 

            // Clean up all the matches marked as pending in the previous run. 
            // Will rejudge all of them. 
            const pendingMatches = []
            for(const match of this.#cache.matchResults.keys()) { 
                pendingMatches.push(match); 
            }
            for(const match of pendingMatches) {
                delete this.#cache.matchResults[match]; 
            }
        } 
        else {
            // Initialize a new run
            const contestDocument = await ContestModel.findOne({id: this.#contestId}); 

            // Initalize cache and result and save in the database
            this.#cache = {};
            this.#cache.initialized = true;  

            // Get the final submissions from users. 
            if(runDocument.includeUnofficial) { 
                this.#cache.finalSubmissions = contestDocument.finalSubmissions; 
            }
            else { 
                this.#cache.finalSubmissions = contestDocument.finalOfficialSubmissions; 
            }
            console.log("List of final Submissions: ", this.#cache.finalSubmissions); 
            this.#cache.matchResults = {}; 

            this.#results = {}; 
            this.#results.matches = []; 
            
            await this.#saveData(); 
        }
    }
    
    /**
     *  Function to feed the contest processor the next unjudged match. Since all the matches of an all-vs-all 
     * is decided beforehand, there is no need to hold until the next match is decided. 
     **/
    async yieldNextUnjudgedMatch() {
        const players = Array.from(this.#cache.finalSubmissions.keys()); 

        console.log("Final submissions: "); 
        console.log(this.#cache.finalSubmissions); 

        // Go through every possible matches
        for(let i = 0; i < players.length; i++) { 
            for(let j = i + 1; j < players.length; j++) { 

                // Key to access the result of this match from cache
                const key = players[i] + "vs" + players[j]; 

                // If this match has not been feeded to the processor
                if(this.#cache.matchResults[key] === undefined) { 

                    // Mark the match as has been feeded to the processor
                    this.#cache.matchResults[key] = null; 

                    const player1 = players[i]; 
                    const player2 = players[j]; 
                    const submissionId1 = this.#cache.finalSubmissions.get(player1); 
                    const submissionId2 = this.#cache.finalSubmissions.get(player2); 

                    // Fetch url for needed source codes and judge file from the database
                    const judgeUrl = await this.#fetchJudgeUrl(); 
                    const sourceUrl1 = await this.#fetchSourceUrl(submissionId1); 
                    const sourceUrl2 = await this.#fetchSourceUrl(submissionId2); 

                    // Handler when the result come back
                    const resultHandler = async (result) => { 
                        const {
                            firstPlayerWin, 
                            logUrl
                        } = result; 
                    
                        this.#cache.matchResults[key] = result; 
                    
                        this.#results.matches.push({ 
                            player1,  
                            player2, 
                            submissionId1, 
                            submissionId2, 
                            winner: firstPlayerWin? player1: player2, 
                            logUrl
                        })
                    
                        await this.#saveData(); 
                    }

                    return { 
                        judgeUrl, 
                        sourceUrl1, 
                        sourceUrl2, 
                        handleResult: resultHandler
                    }
                }
            }
        }

        return null; 
    }

    /**
     * Internal function to fetch the source code url for a submission from the database 
     */
    async #fetchSourceUrl(submissionId) { 
        const submissionDocument = await SubmissionModel.findOne({id: submissionId}); 
        return submissionDocument.sourceUrl; 
    }

    /**
     * Internal function to fetch judge source code from the database
     */

    async #fetchJudgeUrl() { 
        const contestDocument = await ContestModel.findOne({id: this.#contestId}); 
        const gameDocument = await GameModel.findOne({id: contestDocument.gameId}); 
        return gameDocument.judgeUrl; 
    }

    /**
     * Internal unction to save the current run into the database. 
     * string is chosen as type of cache and result since objects are not 
     * automatically saved when they are changed. 
     */
    async #saveData() { 
        await RunModel.findOneAndUpdate({
            id: this.#runId
        }, { 
            cache: JSON.stringify(this.#cache), 
            results: JSON.stringify(this.#results), 
        }); 
    }

    /**
     * Final clean up after running
     */
    async cleanUp() { 
        await RunModel.findOneAndUpdate({
            id: this.#runId
        }, { 
            finishedJudging: true, 
            judgingFinishedDate: new Date(), 
            cache: JSON.stringify(this.#cache), 
            results: JSON.stringify(this.#results), 
        }); 
    }
}