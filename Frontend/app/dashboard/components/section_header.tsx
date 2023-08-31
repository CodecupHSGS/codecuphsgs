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
}): JSX.Element { 
    const pathName = usePathname(); 
    const userInfo = getUserInfo(); 

    return (
            // {/* If length is not converted to String -> lead to bug, I do not reall know why */}
        <nav className={`h-10 w-full grid grid-cols-12 items-center bg-gray-400`}>            
            {
                sectionTabs.map((sectionTab, index) => 
                    <SectionTab 
                        key={index}
                        selected={pathName === sectionTab.href} 
                        sectionTab={sectionTab}/>
                )
            }
        </nav>
    )
}