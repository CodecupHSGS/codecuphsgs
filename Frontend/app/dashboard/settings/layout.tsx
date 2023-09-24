"use client"; 

import { ReactNode } from "react";
import SectionHeader from "../utils/sectionHeader";
import SubsectionBodyContainer from "../utils/subsectionBodyContainer";

const sectionTabs = [
    {
        href:"/dashboard/settings/general", 
        title:"General", 
        adminRequired:false, 
    }
]

export default function SettingsLayout({
    children
}: { 
    children: ReactNode
}) { 

   
    return (
        <div className="w-full h-full">
            <SectionHeader sectionTabs={sectionTabs}></SectionHeader>
            <SubsectionBodyContainer>
                {children}
            </SubsectionBodyContainer>
        </div>
    )
}