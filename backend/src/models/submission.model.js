import { Schema, model } from "mongoose";

const submissionSchema = new Schema ({ 
    id: {type: Number}, 
    userId: {type: Number}, 
    contestId: {type: Number}, 
    submissionDate: {type: Date, default: () => new Date()}, 
    language: {type: String, default: "cpp"}, 
    official: {type: Boolean, required: true}, 
    sourceUrl: {type: String}, 
})

const SubmissionModel = model('Submission', submissionSchema); 

export default SubmissionModel; 
