import fs from "fs"; 
import axios from "axios";
import FormData from "form-data"
import {Server} from "socket.io";
import http from "http"; 
import express from "express"
import assert from "assert";

const JUDGE_SERVER_URL = process.env.JUDGE_SERVER_URL; 
const SOCKET_SERVER_PORT = process.env.SOCKET_SERVER_PORT; 

// Axios instance to make http requests to the judge server
const axiosInstance = axios.create({
    baseURL: JUDGE_SERVER_URL, 
    timeout:5000, 
});

/**
 * Data structure for locking and freeing ids. 
 * Each id can only be locked and freed once. 
 * If the id is freed before it is locked, calling lock on the id won't have any effect. 
 * If the id is locked before it is free, calling waitUntilFreed(id) will only resolves 
 * when free(id) is called
 */
class Locker {
    #promises = {}; 
    #resolvers = {}; 
    #freed = {}; 

    lock(id) { 
        if(this.#promises[id] !== undefined) { 
            throw new Error("This id has already been locked"); 
        }

        this.#promises[id] = new Promise((resolve) => { 
            this.#resolvers[id] = resolve; 
        })

        // This id is already freed before it is even locked
        if(this.#freed[id] === true) { 
            this.#resolvers[id](); 
        }
    }
    
    async waitUntilFreed (id){ 
        await this.#promises[id]; 
    }

    free(id) { 
        console.log(Object.keys(this))
        if(this.#freed[id] !== undefined) { 
            throw new Error("This id has already been freed"); 
        }

        this.#freed[id] = true; 

        // This id has been locked 
        if(this.#promises[id]) { 
            this.#resolvers[id](); 
        }
    }
};

const locker = new Locker();

// Promises that are blocked until a new socket client is added 
const blockedPromisesResolvers = []; 

// Socket Clients connecting this socket server
const sockets = []; 

async function blockUntilJudgeConnected() { 
    if(sockets.length > 0) { 
        return; 
    }

    // No socket clients are currently connected
    console.log("No socket clients are currently connected. A submission is blocked"); 
    const promise = new Promise((resolve) => { 
        blockedPromisesResolvers.push(resolve); 
    }); 

    await promise; 
}

/**
 * Function to handle a new conection (from the judge)
 */
function handleNewSocketConnection(socket) { 
    console.log("Accecepted connection from the judge server"); 

    // Create a listener to the judges' judging complete notifications. 
    // Once the notification is received, free the lock on this receipt id so that 
    // the function waiting for the judge to finish can run
    socket.on('finish_judge', (receiptId) => { 
        console.log("Received notification that the judge server finished #" + receiptId)
        locker.free(receiptId); 
    })

    sockets.push(socket); 

    // Unblock the submissions that are currently blocked 
    for(const resolve of blockedPromisesResolvers) { 
        resolve(); 
    }
    // clear the list of resolvers. 
    blockedPromisesResolvers.splice(0, blockedPromisesResolvers.length); 
}

/**
 * Function to send a match to the judge and wait for the result
 */
async function submit(judgeUrl, sourceUrl1, sourceUrl2) { 
    await blockUntilJudgeConnected(); 

    const judgeReceiptId = await sendFiles(judgeUrl, sourceUrl1, sourceUrl2);
    
    if(!judgeReceiptId) { 
        console.error("Failed to send file"); 
        return null; 
    }
    
    // Hold until the judge have finished judging this match
    await waitFinishJudging(judgeReceiptId); 

    // Make a http request to fetch the result of the match
    const result = await fetchResult(judgeReceiptId);

    console.log(result); 

    assert(result.winner === 1 || result.winner === 2); 
    const firstPlayerWin = result.winner === 1; 

    // Make a http request to fetch the log of the match
    const logUrl = await fetchLog(judgeReceiptId); 
    assert(logUrl != null); 

    console.log("Result for match with receipt " + judgeReceiptId + ": "); 
    console.log({firstPlayerWin, logUrl}); 

    return {firstPlayerWin, logUrl}; 
}

/**
 * Function to send http request containing source files to judge. 
 */
async function sendFiles(judgeUrl, sourceUrl1, sourceUrl2) { 
    console.log("Sending source codes to judge"); 

    const formData = new FormData(); 
    
    if(!fs.existsSync(sourceUrl1) || !fs.existsSync(sourceUrl2) || !fs.existsSync(judgeUrl)) { 
        console.error("Error at sendFiles: file does not exists"); 
        throw new Error("file does not exists"); 
    }

    formData.append('judge', fs.createReadStream(judgeUrl), "judge.cpp"); 
    formData.append('player1', fs.createReadStream(sourceUrl1), "player1.cpp"); 
    formData.append('player2', fs.createReadStream(sourceUrl2), "player2.cpp");
    
    let response; 
    try { 
        response = await axiosInstance.request({ 
            method: "post", 
            url: `/submit`, 
            headers:{
                'Content-Type': 'multipart/form-data'
            }, 
            data: formData
        }); 
    } catch(err) { 
        console.error("Sending files to judge failed. Error: ");
        console.error(err); 
        throw new Error("Fetching failed"); 
    }

    if(response.status != 200) { 
        console.log("Error sending file to judge"); 
        throw new Error("Sending file failed"); 
    }

    try { 
        console.log(response.data)
        return response.data.submission_id; 
    } catch(error) { 
        console.error("Error at sending file: " + error); 
        throw new Error("Sending file failed"); 
    }
}

/**
 * Function to send a http request to fetch the result of a match 
 */
async function fetchResult(judgeReceiptId) { 
    let response; 
    try { 
        response = await axiosInstance.request({
            method:'get', 
            url:'/result/' + judgeReceiptId, 
        }); 
    } catch(error) { 
        console.error("Error: fetching result failed");
        throw new Error("fetching result failed"); 
    }
    if(response.status != 200) { 
        console.error("Error: judge fetch error"); 
        throw new Error("Judge fetching error"); 
    }
    
    const {result} = await response.data; 
    return result; 
}


/**
 * Function to send a http request to fetch the log of a match 
 */
async function fetchLog(judgeReceiptId) { 
    let response; 
    try { 
        response = await axiosInstance.request({ 
            method:'get', 
            url: `/log/${judgeReceiptId}`
        }); 
    } catch(error) { 
        console.error("Error: fetching log failed");
        throw new Error("fetching log failed"); 
    }
    
    if(response.status != 200) { 
        console.error("Error: judge fetch error"); 
        throw new Error("Judge fetching error"); 
    }

    const text_data = response.data; 
    
    const url = process.cwd() + "/logs/logs_" + judgeReceiptId + ".txt"; 
    fs.writeFileSync(url, text_data, (err) => { 
        console.error(err); 
    })

    return url; 
}

/**
 * Function to wait for the judge to finish judging a match
 * The socket server wait for the the socket client (the judge) to emit 
 * the event that the judge has finished judgiin
 */
async function waitFinishJudging(judgeReceiptId) { 
    console.log("Wating for " + judgeReceiptId + " to finish"); 
    
    // A promise that will only resolve when the socket server 
    // receive the event that this match has been judged. 
    locker.lock(judgeReceiptId); 
    console.log("Lock for #" + judgeReceiptId + " locked")
    
    // Hold until the promise is resolved
    await locker.waitUntilFreed(judgeReceiptId); 

    console.log("Lock for #" + judgeReceiptId + " freed")

    console.log("Finished juding for " + judgeReceiptId); 
}

/**
 * Function to notify the judge server that the socket server is online, 
 * so that it can create a connection to the socket server. 
 */
async function notifyJudgeServer() { 
    try { 
        const response = await axiosInstance.request({
            method:'get', 
            url:'/connect', 
        }); 
        if(response.status != 200) { 
            console.error("Error: Status != 200 when notifying the judge server that the socket server is online"); 
        }
        else { 
            console.log("Notified the judge server that the socket server is online"); 
        }
    } catch(err) { 
        console.error("Error: Failed to notify the judge server that the socket server is online" + err);
    }
}

// Create a new socket server
const app = express(); 
const server = http.createServer(app); 
const socketServer = new Server(server); 

// When the socket server is listening, ping the judge server
socketServer.on('listening', notifyJudgeServer); 

// Handle new connection from judge
socketServer.on("connection", handleNewSocketConnection)

server.listen(SOCKET_SERVER_PORT, () => { 
    console.log("Worker's http server listening on " + SOCKET_SERVER_PORT); 
}); 

const submitService = { 
    submit
}

export default submitService; 