"use client"; 

import { saveUserInfo } from "@/session_storage_api/api";
import {login} from "../../../backend_api/users"
import Link from "next/link";
import {useState} from "react"
import { useRouter } from "next/navigation";
import alertBackendAPIError from "@/app/utils/alertSystem/alertBackendAPIError";
import UserInfoForm from "../utils/userInfoForm";
import FormContainer from "../utils/formContainer";

export default function LoginPage() { 
    const [username, setUsername] = useState<null | string>(null); 
    const [password, setPassword] = useState<null | string>(null); 
    const [email, setEmail] = useState<null | string>(null); 
    const router = useRouter(); 

    function onUsernameChanged(value: string) { 
        setUsername(value); 
    }
    
    function onPasswordChanged(value: string) { 
        setPassword(value); 
    }

    function onEmailChanged(value: string) { 
        setEmail(value); 
    }

    async function onSubmit() {
        try { 
            const userInfo = await login({
                username, 
                email, 
                password
            }); 
                
            saveUserInfo(userInfo); 
            
            router.push("/dashboard"); 
        }
        catch (error) { 
            alertBackendAPIError(error, "loginSubmitHandler"); 
        }
    }

    return (
        <FormContainer>
            <UserInfoForm
                title="Login"
                onUsernameChanged={onUsernameChanged}
                onEmailChanged={onEmailChanged}
                onPasswordChanged={onPasswordChanged}
                onSubmit={onSubmit}
                action="Login"
            />
            <hr className="w-full"></hr>
            <div className="w-full text-sm mt-4"> 
                Don&apos;t have an account?&#160;
                <Link href="/authentication/signup" className="underline">Register here</Link>
            </div>
        </FormContainer>
    )
}