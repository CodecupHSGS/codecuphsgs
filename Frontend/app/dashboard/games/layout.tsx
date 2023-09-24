"use client"; 

import { ReactNode } from "react";
import SectionHeader from "../utils/sectionHeader";
import { retrieveUserInfo } from "@/session_storage_api/api";

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
    /* put the contestsInfo here to reduce the number of fetch request. 
    Persist until rerender contest page / reload */
    // for ... in iterates through the keys, not the values

    const userInfo = retrieveUserInfo(); 

    const sectionTabsFiltered = sectionTabs.filter((sectionTab) => { 
        if(sectionTab.adminRequired && userInfo?.userIsAdmin == false) { 
            return false; 
        }

        return true; 
    }); 

    return (
        <div className="w-full h-full">
            <SectionHeader sectionTabs={sectionTabs}></SectionHeader>
            <div className="w-full h-full text-sm p-6">{children}</div>
        </div>
    )
}