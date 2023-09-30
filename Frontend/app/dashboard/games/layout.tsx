"use client"; 

import { ReactNode, useContext } from "react";
import SectionHeader from "../utils/sectionHeader";
import { userInfoContext } from "../layout";
import SubsectionBodyContainer from "../utils/subsectionBodyContainer";

const sectionTabs = [
    {
        href:"/dashboard/games/list", 
        title:"List", 
        adminRequired:false, 
    }, 
    {
        href:"/dashboard/games/create" , 
        title:"Create", 
        adminRequired:true, 
    }
]

export default function GamesLayout({
    children
}: { 
    children: ReactNode
}) { 
    const userInfo = useContext(userInfoContext); 

    if(userInfo === null) { 
        return null; 
    }

    const sectionTabsFiltered = sectionTabs.filter((sectionTab) => { 
        if(sectionTab.adminRequired && !userInfo.userIsAdmin) { 
            return false; 
        }

        return true; 
    }); 

    return (
        <div className="w-full h-full">
            <SectionHeader sectionTabs={sectionTabsFiltered}></SectionHeader>
            <SubsectionBodyContainer>{children}</SubsectionBodyContainer>   
        </div>
    )
}