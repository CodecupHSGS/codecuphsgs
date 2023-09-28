function submissionRestrictedView(submission) { 
    const { 
        id, 
        userId, 
        contestId, 
        language, 
        isOfficial, 
        submissionDate
    } = submission; 

    return { 
        id, 
        userId, 
        contestId, 
        language, 
        isOfficial, 
        submissionDate
    }; 
}

export { 
    submissionRestrictedView
}