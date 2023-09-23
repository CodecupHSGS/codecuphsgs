"use client";

import { useEffect, useState } from "react";
import { retrieveUserInfo, UserInfo } from "@/session_storage_api/api";
import NavBar from "./navbar";
import BodyContainer from "./bodyContainer";
// import { retrieveUserInfo } from "@/session_storage_api/api";
import { useRouter } from "next/router";

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
          <NavBar userInfo={userInfo}></NavBar>
          <BodyContainer>
              {children}
          </BodyContainer>
      </div>
  )
}
