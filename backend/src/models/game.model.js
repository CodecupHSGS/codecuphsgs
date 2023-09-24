import { Schema, model } from "mongoose";

const gameSchema = new Schema({
    id: {type: Number, required: true}, 
    name: {type: String, required: true}, 
    createdDate: { type: Date, required: true}, 
    statementUrl: {type: String}, 
    judgeUrl: {type: String, required: true}, 
    renderUrl: {type: String}, 
})

const GameModel = model('game', gameSchema)
export default GameModel; 