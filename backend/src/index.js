
import "./dotenv.js"; 

console.log("ENV: ")
console.log(process.env); 

import mongoose from "mongoose"; 

// set mongoose connection before importing services
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URI)

import app from "./server/index.js";
// import contestPostEndingProcessor from "./worker/index.js";

// contestPostEndingProcessor.start(); 

// START LISTENING
const server = app.listen(5000, () => { 
    console.log("server on"); 
})

// tests
// import judgeAPIWrapper from "./worker/judgeAPIWrapper.js";

// judgeAPIWrapper.on("ready", () => { 
//     judgeAPIWrapper.submit(13, 13); 
// }); 