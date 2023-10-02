import { Schema, model } from "mongoose";
import getCountAndAdd from "./counter.js";

const runSchema = { 
    id: {type: Number, required: true, unique: true}, 

    contestId: {type: Number, required: true}, 
    includeUnofficial: {type: Boolean, required: true},
     
    format: {type: String, required: true, enum: ['round-16', 'all-vs-all', 'tournament'], default: 'all-vs-all'} ,

    createdDate: {type: Date, required: true, default: () => new Date()}, 
    
	finishedJudging: { type: Boolean, default: false}, 
    judgingFinishedDate: {type: Date}, 

	cache: {type: String, default: "{}"},
	results: {type: String, default: "{}"}
}

const RunModel = new model("run", runSchema); 
export default RunModel; 

export async function getNextRunId() { 
	return await getCountAndAdd('run'); 
}