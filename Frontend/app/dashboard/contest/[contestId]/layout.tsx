"use client"; 

import {ReactNode, createContext, useEffect, useState, useContext} from "react";
import SectionHeader from "../../utils/sectionHeader";
import { useParams } from "next/navigation";
import SubsectionBodyContainer from "../../utils/subsectionBodyContainer";
import { retrieveUserInfo, UserInfo } from "@/session_storage_api/api";
import { ContestDetails, getContestDetails } from "@/backend_api/contests";
import { userInfoContext } from "../../layout";

const contestDetailsContext = createContext<null | ContestDetails>(null); 

export default function ContestDetailsLayout({
    children
}: { 
    children: ReactNode
}) { 
    const params = useParams(); // so useParams is different from useSearchParams. 
    const userInfo = useContext(userInfoContext); 

    const [contestDetails, setContestDetails] = useState<null | ContestDetails>(null); 

    async function fetchAndSetContestDetails() {
        setContestDetails(await getContestDetails(parseInt(params.contestId))); 
        console.log("setting context lmao");
    }

    // After first render
    useEffect(() => { 
        fetchAndSetContestDetails(); 
    }, []); 

    // // During first render, the user's information is not available. 
    // if(userInfo === null) { 
    //     return null; 
    // }

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
            <contestDetailsContext.Provider value={contestDetails}>
                <SectionHeader sectionTabs={sectionTabsFiltered}></SectionHeader>
                <SubsectionBodyContainer>{children}</SubsectionBodyContainer>
            </contestDetailsContext.Provider>
        </div>
    )
}

export { 
    contestDetailsContext
}