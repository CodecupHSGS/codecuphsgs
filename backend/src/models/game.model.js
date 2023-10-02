import { Schema, model } from "mongoose";
import getCountAndAdd from "./counter.js";

const gameSchema = new Schema({
    id: {type: Number, required: true, unique: true}, 

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

export async function getNextGameId() { 
	return await getCountAndAdd('game'); 
}