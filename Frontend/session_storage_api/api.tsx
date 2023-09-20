import { ContestDetails, ContestInfo } from "@/backend_api/contests";

interface UserInfo { 
    userId: number, 
    username: string, 
    userIsAdmin: boolean; 
}

function setUserInfo(userInfo: UserInfo | null) { 
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo)); 
}

function getUserInfo(): UserInfo | null { 
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
    setUserInfo, 
    getUserInfo
}