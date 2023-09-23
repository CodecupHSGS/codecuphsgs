import { ContestDetails, ContestInfo } from "@/backend_api/contests";

interface UserInfo { 
    userId: number, 
    username: string, 
    userIsAdmin: boolean; 
}

function saveUserInfo(userInfo: UserInfo | null) { 
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo)); 
}

function retrieveUserInfo(): UserInfo | null { 
    if(typeof window === "undefined" ) { 
        return null; 
    }
    let userInfoString = sessionStorage.getItem('userInfo'); 
    if(userInfoString === null || userInfoString === undefined || userInfoString.length === 0) { 
        return null; 
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