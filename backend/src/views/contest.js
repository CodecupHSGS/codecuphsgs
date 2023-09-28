function contestRestrictedView(contest) { 
    const { 
        id, 
        name, 
        gameId, 
        startDate, 
        endDate, 
    } = contest; 

    return { 
        id, 
        name, 
        gameId, 
        startDate, 
        endDate, 
    } 
}

export { 
    contestRestrictedView
}