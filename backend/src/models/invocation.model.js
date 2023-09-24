
import { Schema, model } from "mongoose";

const invocationSchema = new Schema({
    id: {type: Number, required: true}, 
    userId: {type: Number, required: true}, 
    createdDate: {type: Date, default: () => new Date()}, 
    contestId: {type: Number, required: true}, 
    matchId: {type: Number, required: true}, 
})

const InvocationModel = model('invocation', invocationSchema)
export default InvocationModel; 