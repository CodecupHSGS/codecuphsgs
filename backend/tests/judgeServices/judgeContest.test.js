import "./dotenv.js"; 
console.log(process.env["JUDGE_URL"])
import mongoose from "mongoose";
import judgeContest from "../../src/judgeService/judgeContest";
import judgeAPIWrapper from "../../src/judgeService/judgeAPIWrapper.js";

describe("testing judgeService API", () => {

    beforeAll(async() => { 
        mongoose.set('strictQuery', true);
        await mongoose.disconnect();
        await mongoose.connect('mongodb+srv://codecuphsgs:ec7BsleaV4AnrEnQ@cluster0.vxmdbjv.mongodb.net/codecuphsgs_dev');
    })

    it("Test API", async () => { 
        await judgeContest({
            contestId: 4, 
            includeUnofficial: true, 
        })
    }, 200000)

    afterAll(async() => { 
        try {
            await mongoose.disconnect(); 
        } catch(e) { 
            console.error(e); 
        }
        await judgeAPIWrapper.close(); 
    })
}); 