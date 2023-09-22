import { Schema, SchemaType, model } from "mongoose";

const contestSchemaOptions = { discriminatorKey: 'contestFormat'}; 

const contestSchema = new Schema({
	id: {type: Number, required: true, unique: true},

    name: {type: String, required: true},
	gameId: {type: Number, required: true}, 
	startDate: {type: Date, default: () => new Date()},
	endDate: {type: Date, default: () => new Date()},

	runTrialMatches: {type: Boolean, default: true}, 
    judgeMode: {type: String, enum: ['manual-judge', 'auto-judge'], default: 'auto-judge'}, 
    contestFormat: {type: String, enum: ['round-16', 'all-vs-all'], default: 'all-vs-all'} ,

	finalSubmissions: {type: Map, of: Number, default: {}}, 

	startedJudging: {type: Boolean, default: false}, 
	finishedJudging: { type: Boolean, default: false}, 
	currentState: {type: String, default: ""},
	result: {type: String, default: ""}
}, contestSchemaOptions); 

const  ContestModel = model('Contest', contestSchema)
export default ContestModel; 

