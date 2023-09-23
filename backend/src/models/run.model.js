import { Schema, model } from "mongoose";

const runSchema = { 
    id: {type: Number, required: true}, 
    contestId: {type: Number, required: true}, 
    includeUnofficial: {type: Boolean, required: true}, 
    startDate: {type: Date, required: true}, 
    endDate: {type: Date}, 
	finishedJudging: { type: Boolean, default: false}, 
	cache: {type: String, default: ""},
	results: {type: String, default: ""}
}

const RunModel = new model("run", runSchema); 
export default RunModel; 