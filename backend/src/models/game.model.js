import { Schema, model } from "mongoose";

const gameSchema = new Schema({
    id: {type: Number, required: true}, 

    name: {type: String, required: true}, 
    createdDate: { type: Date, required: true, default: () => new Date()}, 
    
    summary: {type: String}, 

    // URL to the judge file
    judgeUrl: {type: String, required: true}, 

    statementUrl: {type: String}, 
    renderUrl: {type: String}, 
})

const GameModel = model('game', gameSchema)
export default GameModel; 