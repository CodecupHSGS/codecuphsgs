import { getGameInfo } from './games';
import validateResponse from './validation_utils/validateResponse';
import UnknownInternalError from './errors/unknownInternalError';
import ServerError from './errors/serverError';
import ValidationError from './errors/validationError';


enum ContestFormat {
    ALL_VS_ALL = "all-vs-all", 
    ROUND_16 = "round-16"
}

enum JudgeMode { 
    MANUAL_JUDGE = "manual-judge", 
    AUTO_JUDGE = "auto-judge"
}

interface ContestInfo { 
    contestId: number, 
    contestName: string, 
    gameId: number, 
    overview: string, 
    startDate: Date, 
    endDate: Date, 
    contestFormat: ContestFormat, 
    trialJudge: boolean, 
    judgeMode: JudgeMode, 
    startedJudging: boolean, 
    finishedJudging: boolean, 
}

interface ContestDetails { 
    contestId: number, 
    contestName: string, 
    startDate: Date, 
    endDate: Date, 
    gameId: number, 
    gameName: string, 
    gameStatementUrl: string, 
    gameRenderUrl: string
}

interface SubmissionInfo { 
    submissionId: number, 
    contestId: number, 
    userId: number, 
    username?: number, 
    submissionDate: Date
    isOfficial: boolean
}

interface ContestResults { 
    results: Object, 
    finishedJudging: boolean, 
    startedJudging: boolean, 
    createdDate: Date, 
}

interface Invocation { 
    invocationId: number, 
    createdDate: Date, 
    submission1Id: number, 
    submission2Id: number, 
    finishedJudging: boolean
    winner: number, 
}

async function createContest(contestInfo:Object) : Promise<{
    success: boolean, 
    msg: string
}> {
    const response = await fetch("/api/contests/create", 
        { 
            method: "POST", 
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify(contestInfo), 
        }
    ); 

    const { status, body} = await validateResponse(response); 

    try { 
        return body.contest; 
    }
    catch(error: any) { 
        console.log("Unknown internal api error at create contest api: " + error); 
        throw new UnknownInternalError(); 
    }
}

async function getAllContests() : Promise<ContestInfo[]>{  
    const response = await fetch("/api/contests"); 

    const { status, body} = await validateResponse(response); 
    
    try { 
        return body.contests.map((contest: any) => {
                return { 
                    contestId: contest.id, 
                    contestName: contest.name, 
                    startDate: new Date(contest.startDate), 
                    endDate: new Date(contest.endDate),
                }
            })
    } catch(error: any) {
        console.log("Unknown internal api error at getAllContests api: " + error); 
        throw new UnknownInternalError(); 
    }
}

async function getContestDetails(
    contestId: number
): Promise<ContestDetails> { 
    const response = await fetch("/api/contest/" + contestId); 

    const {status, body} = await validateResponse(response); 
    
    const contest = body.contest; 

    const game = await getGameInfo(contest.gameId); 

    try { 
        return { 
                contestId: contest.id, 
                contestName: contest.name, 
                startDate: new Date(contest.startDate), 
                endDate: new Date(contest.endDate), 
                gameId: game.id, 
                gameName: game.name, 
                gameStatementUrl: game.statementUrl, 
                gameRenderUrl: game.renderUrl
        }
    }
    catch(error: any) {
        console.log("Error at getContestDetails API: " + error); 
        throw new UnknownInternalError(); 
    }
}

async function submitCode({
    isOfficial, 
    contestId, 
    file
}:{ 
    isOfficial: boolean
    contestId: number, 
    file: File
}): Promise<SubmissionInfo> {
    if(!file) { 
        throw new ValidationError("File missing"); 
    }
    if(typeof contestId != "number") { 
        throw new ValidationError("ContestId is not a number")
    }

    const data = new FormData(); 

    data.append("sourceCode", file); 
    data.append("isOfficial", isOfficial.toString()); 
    const response = await fetch("/api/contest/" + contestId + "/submit", 
        { 
            method: "POST", 
            body: data
        }
    ); 

    const {status, body} = await validateResponse(response);
    
    try { 
        const submission = body.submission; 
        return { 
            submissionId: submission.submissionId, 
            contestId: submission.contestId, 
            userId: submission.userId, 
            submissionDate: submission, 
            isOfficial: submission.isOfficial
        }
    }catch(error: any) {
        console.log("Error at submitCode API: " + error); 
        throw new UnknownInternalError(); 
    }
}

async function getSubmissions({ 
    includeUnofficial, 
    contestId
}: { 
    includeUnofficial: boolean, 
    contestId: number
}) {
    if(!includeUnofficial || !contestId) { 
        throw new ValidationError("Missing parameters"); 
    }

    if(typeof includeUnofficial != "boolean" || typeof contestId != "number") { 
        throw new ValidationError("Wrong parameter type"); 
    }

    const fetchUrl = "/api/contest/" + contestId + "/submissions?includeUnofficial=" + (includeUnofficial? "true": "false"); 
    const response = await fetch(fetchUrl); 

    const {status, body} = await validateResponse(response); 

    try { 
        const submissions: Array<any> = body.submissions; 
        return submissions.map((submission) => { 
            return { 
                contestId: submission.contestId, 
                submissionId: submission.submissionId, 
                userId: submission.userId, 
                username: submission.username, 
                isOfficial: submission.isOfficial, 
                submissionDate: new Date(submission.submissionDate), 
            }
        })
    } catch(e) { 
        console.log("Error at fetching submissions API: " + e);
        throw new UnknownInternalError(); 
    }
}



async function getResult({ 
    contestId, 
    includeUnofficial
}: { 
    contestId:Number, 
    includeUnofficial:boolean
}): Promise<ContestResults> {
    const response = await fetch(`/api/contest/${contestId}/results?includeUnofficial=${includeUnofficial}`);
    
    const {status, body} = await validateResponse(response);
    const {createdDate, ...rest} = body.results; 
    return { 
        createdDate: new Date(createdDate), 
        ...rest
    }; 
}

async function createRun({ 
    contestId, 
    includeUnofficial 
}:{ 
    contestId: number, 
    includeUnofficial: boolean
}) {
    const response = await fetch(`/api/contest/${contestId}/createRun?includeUnofficial=${includeUnofficial}`, {
        method: "POST"
    });
    
    const {status, body} = await validateResponse(response); 
}

async function runInvocation({ 
    submission1Id, 
    submission2Id, 
    contestId
}:{ 
    submission1Id: number,
    submission2Id: number, 
    contestId: number, 
}) {
    const response = await fetch(`/api/contest/${contestId}/invoke`, { 
        method: "POST", 
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({submission1Id, submission2Id, contestId}),
    });
    
    const {status, body} = await validateResponse(response); 
}

async function getAllInvocations({ 
    contestId
}:{ 
    contestId: number
}): Promise<Invocation[]> {
    const response = await fetch(`/api/contest/${contestId}/invocations`);
    
    const {status, body} = await validateResponse(response); 
    const { invocations } = body; 
    
    console.log(invocations); 

    return  invocations.map((invocation: any) => { 
        return {
            invocationId: invocation.id, 
            createdDate: new Date(invocation.createdDate), 
            contestId: invocation.contestId, 
            submission1Id: invocation.submission1Id, 
            submission2Id: invocation.submission2Id, 
            finishedJudging: invocation.finishedJudging, 
            winner: invocation.winner, 
        }
    }); 
}

export type {  
    ContestInfo, 
    ContestDetails, 
    SubmissionInfo, 
    ContestResults, 
    Invocation
}

export { 
    ContestFormat, 
    JudgeMode, 
    getAllContests, 
    getContestDetails, 
    submitCode, 
    createContest, 
    getResult, 
    getSubmissions, 
    createRun, 
    runInvocation, 
    getAllInvocations
}