
import { Schema, model } from "mongoose";

const matchSchema = new Schema({
    id: {type: Number, required: true, unique: true}, 

    contestId: {type: Number, required: true}, 
    submission1Id: {type: Number, required: true}, 
    submission2Id: {type: Number, required: true}, 

    createdDate: { type: Date, default: () => new Date()}, 

    finishedJudging: {type: Boolean, default: false}, 
    judgingFinishedDate: {type: Date}, 

    // ID of the winning submission. 
    winner: {type: Number}, 
    logUrl: {type: String}
})

const MatchModel = model('match', matchSchema)
export default MatchModel; 