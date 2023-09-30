"use client"; 

import { ReactNode, useContext } from "react";
import SectionHeader from "../utils/sectionHeader";
import SubsectionBodyContainer from "../utils/subsectionBodyContainer";
import { userInfoContext } from "../layout";

const sectionTabs = [
    {
        href:"/dashboard/settings/account", 
        title:"Account", 
        adminRequired:false, 
        loginRequired:true, 
    }
]

export default function SettingsLayout({
    children
}: { 
    children: ReactNode
}) { 
    const userInfo = useContext(userInfoContext); 

    if(userInfo === null) { 
        return null; 
    }

    const sectionTabsFiltered = sectionTabs.filter(sectionTab => { 
        if(sectionTab.loginRequired && userInfo.userId === undefined) { 
            return false; 
        }
        return true; 
    })
   
    return (
        <div className="w-full h-full">
            <SectionHeader sectionTabs={sectionTabsFiltered}></SectionHeader>
            <SubsectionBodyContainer>
                {children}
            </SubsectionBodyContainer>
        </div>
    )
}