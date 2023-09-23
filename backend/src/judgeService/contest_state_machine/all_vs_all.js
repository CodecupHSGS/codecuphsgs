import RunModel from "../../models/run.model";
import ContestModel from "../../models/contest.model";
import SubmissionModel from "../../models/submission.model";
import GameModel from "../../models/game.model"

export default class AllVsAllStateMachine { 
    /**
     * A state machine for all-vs-all contests, which is able to cache and resume unfinished runs in the database 
     */
    #contestOptions; 
    #contestId; 
    #runId; 
    #cache; 
    #results;   

    constructor({runId, contestOptions}) { 
        if(typeof runId === "number") { 
            // This state machine will continue a previous run. 

            this.#runId = runId; 
        }
        else { 
            // This state machine will start a completely new run. 
            
            if(runId !== undefined && runId !== null) { 
                throw new Error("Unregconizable type of runId parameter at AllVsAllStateMachine"); 
            }

            const { contestId, includeUnofficial } = contestOptions; 
            if(typeof contestId !== "number" || typeof includeUnofficial != "boolean") { 
                throw new Error("Arguments have wrong types at AllVsAllStateMachine"); 
            }

            this.#contestOptions = contestOptions; 
        }
    }

    /**
     * Fetch data from the database to initialize the state machine. 
     * Fetch a previously cached run to continue that run if needed. 
     */
    async init() { 
        console.log("StateMachine initializing"); 

        if(this.#runId !== null && this.#runId !== undefined) { 
            // Restore data from the previous run. 
            const runDocument = await RunModel.findOne({id: this.#runId}); 
            this.#contestId = runDocument.contestId; 
            this.#cache = JSON.parse(runDocument.cache);
            this.#results = JSON.parse(runDocument.results);  

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
            console.log("Finding contest data"); 
            const contestDocument = await ContestModel.findOne({id: this.#contestOptions.contestId}); 
            console.log("Contest data found"); 

            // Create a new run and save in the database
            this.#runId = (await RunModel.count({})) + 1; 

            console.log("New runId" + this.#runId); 

            const runDocument = await RunModel.create({
                id: this.#runId, 
                contestId: this.#contestOptions.contestId, 
                official: this.#contestOptions.includeUnofficial === false
            })

            console.log("Created new run in database"); 

            // Contest Id
            this.#contestId = this.#contestOptions.contestId; 

            // Initalize cache and result and save in the database
            this.#cache = {}; 
            this.#cache.finalSubmissions = contestDocument.finalSubmissions; 
            console.log("List of final Submissions: ", this.#cache.finalSubmissions); 
            this.#cache.matchResults = {}; 
            this.#results = {}; 
            this.#results.matches = []; 

            await this.#updateDocument(); 
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
                    
                        await this.#updateDocument(); 
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
        console.log("Submission: "); 
        console.log(submissionDocument); 
        console.log(submissionDocument.sourceUrl)
        return submissionDocument.sourceUrl; 
    }

    /**
     * Internal function to fetch judge source code from the database
     */

    async #fetchJudgeUrl() { 
        const contestDocument = await ContestModel.findOne({id: this.#contestId}); 
        const gameDocument = await GameModel.findOne({id: contestDocument.gameId}); 
        console.log("game: ")
        console.log(gameDocument); 
        return gameDocument.judgeUrl; 
    }

    /**
     * Internal unction to save the current run into the database. 
     * string is chosen as type of cache and result since objects are not 
     * automatically saved when they are changed. 
     */
    async #updateDocument() { 
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
        await this.#updateDocument(); 
    }
}