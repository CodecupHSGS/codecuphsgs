"use client"; 

import { saveUserInfo } from "@/session_storage_api/api";
import { redirect } from "next/navigation";
import { logout } from "@/backend_api/users";
import { useEffect } from "react";

export default function LogoutPage() { 
    useEffect(() => {
        logout(); 
        saveUserInfo(null);
        redirect("/authentication/login"); 
    }, [])
}