function userInfoRestrictedView(user) { 
    return {
        id: user.id, 
        username: user.username,
        email: user.email, 

        name: user.name, 
        isAdmin: user.isAdmin, 
        contests: user.contests
    }
}


function userInfoUnrestrictedView(user) { 
    return {
        id: user.id, 
        username: user.username,
        email: user.email, 

        name: user.name, 
        isAdmin: user.isAdmin, 
        contests: user.contests
    }
}

export { 
    userInfoRestrictedView, 
    userInfoUnrestrictedView
}