function gameInfoRestrictedView(game) { 
    return { 
        id: game.id, 
        name: game.name, 
        statementUrl: game.statementUrl, 
        judgeUrl: game.judgeUrl, 
        renderUrl: game.renderUrl, 
        createdDate: game.createdDate
    }
}

export { 
    gameInfoRestrictedView
}