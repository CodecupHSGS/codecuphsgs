"use client"; 

import { getUserInfo, UserInfo } from "@/session_storage_api/api";
import hsgs_logo from "../../public/logo.png"
import SectionTab from "./section_tab";
import { SectionTabData } from "./section_tab";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function SectionHeader({
    sectionTabs
}: { 
    sectionTabs: SectionTabData[]
}): JSX.Element | null { 
    const pathName = usePathname(); 
    const userInfo = getUserInfo(); 

    // Find the current section based on the current URL. 
    const currentSectionTab = sectionTabs.find(sectionTab => sectionTab.href === pathName); 

    // If the current URL does not correspond to any sectionTab in sectionHeader, do not render this sectionHeader
    // Otherwise, render the sectionHeader and highlight the corresponding sectionTab.   
    if(currentSectionTab === undefined) {
        return null; 
    }
    else { 
        return (
            <div className={`h-10 w-full grid grid-cols-12 items-center bg-gray-400`}>
                {
                    sectionTabs.map((sectionTab, index) => 
                        <SectionTab 
                            key={index}
                            selected={pathName === sectionTab.href} 
                            sectionTab={sectionTab}/>
                    )
                }
            </div>
        ); 
    }
}