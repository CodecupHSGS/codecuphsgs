"use client"; 

import {ReactNode, createContext, useEffect, useState, useContext} from "react";
import SectionHeader from "../../utils/sectionHeader";
import { useParams } from "next/navigation";
import SubsectionBodyContainer from "../../utils/subsectionBodyContainer";
import { ContestDetails, getContestDetails } from "@/backend_api/contests";
import { userInfoContext } from "../../layout";
import alertBackendAPIError from "@/app/utils/alertSystem/alertBackendAPIError";

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
        try { 
            setContestDetails(await getContestDetails(parseInt(params.contestId))); 
            console.log("setting context lmao");
        } catch(err) { 
            alertBackendAPIError(err, "fetching and setting contest details"); 
        }
    }

    const path = "/dashboard/contest/" + params.contestId; 

    const sectionTabs = [
        { 
            title: "Overview", 
            href: path + "/overview",
            adminRequired: false, 
            loginRequired: false, 
        }, 
        { 
            title: "Statement", 
            href: path + "/statement",
            adminRequired: false, 
            loginRequired: false, 
        }, 
        { 
            title: "Submit", 
            href: path + "/submit",
            adminRequired: false, 
            loginRequired: true, 
        }, 
        { 
            title: "Submissions", 
            href: path + "/submissions",
            adminRequired: false, 
            loginRequired: false, 
        }, 
        { 
            title: "Invocations", 
            href: path + "/invocations",
            adminRequired: false, 
            loginRequired: true, 
        }, 
        { 
            title: "Results", 
            href: path + "/results",
            adminRequired: false, 
            loginRequired: false, 
        }, 
        { 
            title: "Judge", 
            href: path + "/judge",
            adminRequired: true, 
            loginRequired: true, 
        }, 
        { 
            title: "Update", 
            href: path + "/update",
            adminRequired: true, 
            loginRequired: true, 
        },
    ]; 

    // During first render, the user's information is not available. 
    if(userInfo == null) { 
        return null; 
    }

    if(contestDetails == null) { 
        fetchAndSetContestDetails(); 
        return null; 
    }

    const sectionTabsFiltered = sectionTabs.filter((sectionTab) => { 
        // filter out the admin-only sections. userInfo.userIsAdmin can either be undefined (not logged in)
        // or false (logged in and not admin) or true (logged in and is admin)
        if(sectionTab.adminRequired && userInfo.userIsAdmin !== true) { 
            return false; 
        }
        if(sectionTab.loginRequired && userInfo.userId == undefined) { 
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