interface UserInfo { 
    userId: number, 
    username: string, 
    userIsAdmin: boolean; 
}

function saveUserInfo(userInfo: UserInfo | null) { 
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo)); 
}

/**
 * Return null if server-side renderin
 * Return empty object if there is currently no user info
 * Otherwise, return user info
 **/
function retrieveUserInfo(): UserInfo | null { 
    if(typeof window === "undefined" ) { 
        return null; 
    }
    let userInfoString = sessionStorage.getItem('userInfo'); 
    if(userInfoString === null || userInfoString === undefined || userInfoString.length === 0) { 
        return {} as UserInfo; 
    }
    return JSON.parse(userInfoString); 
}

export type { 
    UserInfo
}

export {  
    saveUserInfo, 
    retrieveUserInfo
}