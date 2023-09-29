const MONGODB_URI = process.env.MONGODB_URI; 
const HTTP_SERVER_PORT = process.env.HTTP_SERVER_PORT; 

import mongoose from "mongoose"; 

// set mongoose connection before importing services
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URI)

// load workers
import "./workers/invocationWorker.js"
import "./workers/runWorker.js"

// load main express app
import app from "./server/index.js";
const server = app.listen(process.env.HTTP_SERVER_PORT, () => { 
    console.log("server on"); 
})