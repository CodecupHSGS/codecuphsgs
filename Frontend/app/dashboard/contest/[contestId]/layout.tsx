"use client"; 

import {ReactNode, useEffect, useState } from "react";
import SectionHeader from "../../components/sectionHeader";
import { useParams } from "next/navigation";
import SubsectionBodyContainer from "../../components/subsectionBodyContainer";
import { getUserInfo, UserInfo } from "@/session_storage_api/api";



export default function ContestDetailsLayout({
    children
}: { 
    children: ReactNode
}) { 
    const params = useParams(); // so useParams is different from useSearchParams. 
    const [userInfo, setUserInfo] = useState<null | UserInfo>(null); 

    useEffect(() => { 
        setUserInfo(getUserInfo()); 
    }, []); 

    // During first render, the user's information is not available. 
    if(userInfo === null) { 
        return null; 
    }

    const path = "/dashboard/contest/" + params.contestId; 

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
            adminRequired: false, 
        }, 
        { 
            title: "Results", 
            href: path + "/results",
            adminRequired: false, 
        }, 
        { 
            title: "Update", 
            href: path + "/update",
            adminRequired: true, 
        }, 
        { 
            title: "Judge", 
            href: path + "/judge",
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