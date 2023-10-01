"use client";

import { useState, createContext, useEffect } from "react";
import { UserInfo } from "@/session_storage_api/api";
import NavBar from "./components/navbar";
import BodyContainer from "./utils/bodyContainer";
import alertBackendAPIError from "../utils/alertSystem/alertBackendAPIError";
import { getCurrentUserInfo } from "@/backend_api/users";

const userInfoContext = createContext<null|UserInfo>(null); 

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {  
  const [userInfo, setUserInfo] = useState<null | UserInfo>(null); 
  
  async function fetchUserInfoAndRerender() {
    try { 
      const newUserInfo = await getCurrentUserInfo(); 
      setUserInfo(newUserInfo);     
    } catch(err) { 
      alertBackendAPIError(err, "Fetching user info"); 
    }
  }

  useEffect(() => { 
    fetchUserInfoAndRerender(); 
  }, []); 

  if(userInfo == null) { 
    return null; 
  }

  return (
      <div className="w-full h-full bg-white grid grid-cols-[6vw_94vw]">
          <userInfoContext.Provider value={userInfo}>
            <NavBar userInfo={userInfo}></NavBar>
            <BodyContainer>
                {children}
            </BodyContainer>
          </userInfoContext.Provider>
      </div>
  )
}

export { 
  userInfoContext
}