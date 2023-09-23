import { Schema, model } from "mongoose";

const runSchema = { 
    id: {type: Number, required: true}, 
    contestId: {type: Number, required: true}, 
    official: {type: Boolean, required: true}, 
	finishedJudging: { type: Boolean, default: false}, 
	cache: {type: String, default: ""},
	results: {type: String, default: ""}
}

const RunModel = new model("run", runSchema); 
export default RunModel; 