import { Schema, model } from "mongoose";
import getCountAndAdd from "./counter.js";

const submissionSchema = new Schema ({ 
    id: {type: Number, required: true, unique: true}, 
    
    userId: {type: Number, required: true}, 
    contestId: {type: Number, required: true}, 
    
    submissionDate: {type: Date, required: true, default: () => new Date()}, 
    
    language: {type: String, required: true, default: "cpp"}, 
    
    isOfficial: {type: Boolean, required: true},

    sourceUrl: {type: String, required: true}, 
})

const SubmissionModel = model('Submission', submissionSchema); 

export default SubmissionModel; 

export async function getNextSubmissionId() { 
	return await getCountAndAdd('submission'); 
}