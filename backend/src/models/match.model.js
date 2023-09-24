
import { Schema, model } from "mongoose";

const matchSchema = new Schema({
    id: {type: Number, required: true}, 
    contestId: {type: Number, required: true}, 
    submission1Id: {type: Number, required: true}, 
    submission2Id: {type: Number, required: true}, 
    createdDate: { type: Date, required: true}, 
    finishedJudging: {type: Boolean, default: false}, 
    winner: {type: Number}, // ID of the winning submission. 
    judgedDate: {type: Date}, 
    logUrl: {type: String}
})

const MatchModel = model('match', matchSchema)
export default MatchModel; 