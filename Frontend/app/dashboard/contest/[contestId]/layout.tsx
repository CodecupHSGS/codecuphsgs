"use client"; 

import { ReactNode } from "react";
import SectionHeader from "../../components/section_header";
import { useParams } from "next/navigation";
import SubsectionBodyContainer from "../../components/subsectionBodyContainer";
import { getUserInfo } from "@/session_storage_api/api";



export default function ContestDetailsLayout({
    children
}: { 
    children: ReactNode
}) { 
    const params = useParams(); // wait is this even possible
    // so useParams is different from useSearchParams. 
    const path = "/dashboard/contest/" + params.contestId
    const userInfo = getUserInfo(); 

    const sectionTabs = [
        { 
            title: "Overview", 
            href: path + "/overview",
            adminRequired: false, 
            
        }, 
        { 
            title: "Statement", 
            href: path + "/statement",
            adminRequired: false, 
        }, 
        { 
            title: "Submit", 
            href: path + "/submit",
            adminRequired: false, 
        }, 
        { 
            title: "Submissions", 
            href: path + "/submissions",
            adminRequired: true, 
        }, 
        { 
            title: "Results", 
            href: path + "/results",
            adminRequired: true, 
        }, 
        { 
            title: "Update", 
            href: path + "/update",
            adminRequired: true, 
        }
    ]; 

    const sectionTabsFiltered = sectionTabs.filter((sectionTab) => { 
        if(sectionTab.adminRequired && userInfo?.userIsAdmin == false) { 
            return false; 
        }

        return true; 
    }); 
    
    return (
        <div className="w-full">
            <SectionHeader sectionTabs={sectionTabsFiltered}></SectionHeader>
            <SubsectionBodyContainer>{children}</SubsectionBodyContainer>
        </div>
    )
}