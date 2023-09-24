"use client";

import { useEffect, useState, createContext } from "react";
import { retrieveUserInfo, UserInfo } from "@/session_storage_api/api";
import NavBar from "./components/navbar";
import BodyContainer from "./utils/bodyContainer";

const userInfoContext = createContext<null|UserInfo>(null); 

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {  
  // sessionStorage only available after mounting -> useEffect to retrieveUserInfo
  const [userInfo, setUserInfo] = useState<null | UserInfo>(null); 
  useEffect(() => { 
    setUserInfo(retrieveUserInfo()); 
  }, [])
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