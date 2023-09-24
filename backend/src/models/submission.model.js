import { Schema, model } from "mongoose";

const submissionSchema = new Schema ({ 
    id: {type: Number, required: true}, 
    userId: {type: Number, required: true}, 
    contestId: {type: Number, required: true}, 
    submissionDate: {type: Date, default: () => new Date()}, 
    language: {type: String, default: "cpp"}, 
    isOfficial: {type: Boolean, required: true}, 
    sourceUrl: {type: String, required: true}, 
})

const SubmissionModel = model('Submission', submissionSchema); 

export default SubmissionModel; 
