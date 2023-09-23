export default class MockJudgeAPIWrapper { 
    constructor() {
    }

    async submit(submission1, submission2) { 
        await new Promise((resolve) => setTimeout(resolve, 200)); 
        return { 
            logUrl: "dummy logurl",
            firstPlayerWin: submission1 > submission2
        }
    }
}