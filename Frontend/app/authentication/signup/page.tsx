"use client"; 

import {signup} from "../../../backend_api/users"
import { saveUserInfo } from "@/session_storage_api/api";
import {useState} from "react"
import { useRouter } from "next/navigation";
import Link from "next/link";
import alertBackendAPIError from "@/app/utils/alertSystem/alertBackendAPIError";
import UserInfoForm from "../utils/userInfoForm";
import FormContainer from "../utils/formContainer";


export default function SignupPage() { 
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
            const userInfo = await signup({
                username: username, 
                email: email, 
                password: password
            }); 
           
            saveUserInfo(userInfo); 
            
            router.push("/dashboard"); 
        }
        catch (error) { 
            alertBackendAPIError(error, "signupSubmitHandler"); 
        }
    }

    return (
        <FormContainer>
            <UserInfoForm
                title="Register"
                onUsernameChanged={onUsernameChanged}
                onEmailChanged={onEmailChanged}
                onPasswordChanged={onPasswordChanged}
                onSubmit={onSubmit}
                action="Register"
            />
            <hr className="w-full"></hr>
            <div className="w-full text-sm mt-4"> 
                Already have an account?&#160;
                <Link href="/authentication/login" className="underline">Login here</Link>
            </div>
        </FormContainer>
    )
}