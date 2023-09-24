"use client"; 

import { retrieveUserInfo, UserInfo } from "@/session_storage_api/api";
import { redirect } from "next/navigation";
import { type } from "os";
import { useEffect, useState } from "react";

export default function DashboardPage() { 
    // After the first render, redirect to the appropriate page
    useEffect(() => { 
        if(retrieveUserInfo() === null) { 
            redirect("/authentication/login"); 
        }
        else { 
            redirect("/dashboard/home"); 
        }; 
    }, [])

    // During the server render and first render, return null
    return null;    
}