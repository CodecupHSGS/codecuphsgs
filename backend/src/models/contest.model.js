import { Schema, SchemaType, model } from "mongoose";
import getCountAndAdd from "./counter.js";

const contestSchemaOptions = { discriminatorKey: 'contestFormat'}; 

const contestSchema = new Schema({
	id: {type: Number, required: true, unique: true},

    name: {type: String, required: true},
	gameId: {type: Number, required: true}, 
	startDate: {type: Date, required: true},
	endDate: {type: Date, required: true},

	runTrialMatches: {type: Boolean, default: true}, 
    judgeMode: {type: String, enum: ['manual-judge', 'auto-judge'], default: 'auto-judge'}, 
    contestFormat: {type: String, enum: ['round-16', 'all-vs-all'], default: 'all-vs-all'} ,

	finalOfficialSubmissions: {type: Map, of: Number, default: {}}, 
	finalSubmissions: {type: Map, of: Number, default: {}}, 
}, contestSchemaOptions); 

const  ContestModel = model('Contest', contestSchema)
export default ContestModel; 

export async function getNextContestId() { 
	return await getCountAndAdd('contest'); 
}

