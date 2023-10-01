import { UserInfo } from '@/session_storage_api/api';

import validateResponse from './validation_utils/validateResponse';
import validateInfo from './validateUserInfo';
import UnknownInternalError from './errors/unknownInternalError';

async function logout() {
    const response = await fetch("/api/logout", 
        { 
            method: "POST", 
        }
    ); 

    const {status, body} = await validateResponse(response); 
}

async function signup({
    username, 
    password,
    email
}: { 
    username: string | null, 
    password: string | null, 
    email: string | null, 
}) : Promise<UserInfo> { 
    // throw error if info not good
    validateInfo({username, password, email}); 

    const response = await fetch("/api/register", 
        { 
            method: "POST", 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                username: username, 
                email: email, 
                password: password
            })
        }
    ); 

    // throw fetchError if response validation fails...
    const {status, body} = await validateResponse(response); 

    try { 
        return { 
            userId: body.user.id, 
            username: body.user.username, 
            userIsAdmin: body.user.isAdmin
        }
    } catch(error: any) {
        console.error("Unknown error at signup API: " + error); 
        throw new UnknownInternalError(); 
    }

}

async function login({
    username, 
    password,
    email
}: { 
    username: string | null, 
    password: string | null, 
    email: string | null, 
}) : Promise<UserInfo> 
{ 
    validateInfo({username, password, email}); 

    const response = await fetch("/api/login", 
        { 
            method: "POST", 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                username: username, 
                email: email, 
                password: password
            })
        }
    ); 

    const {status, body} = await validateResponse(response); 

    try { 
        return { 
            userId: body.user.id, 
            username: body.user.username, 
            userIsAdmin: body.user.isAdmin
        }
    }
    catch(error: any) {
        console.error("Unknown error at login API: " + error); 
        throw new UnknownInternalError(); 
    }

}

async function getCurrentUserInfo(): Promise<UserInfo> {
    const response = await fetch("/api/user/current"); 
    
    if(response.status === 403) { 
        // backend response: not logged in 
        return {} as UserInfo; 
    }

    const {status, body} = await validateResponse(response); 
    return { 
        userId: body.user.id, 
        username: body.user.username, 
        userIsAdmin: body.user.isAdmin
    }
}

export { 
    signup, 
    login, 
    logout, 
    getCurrentUserInfo
}