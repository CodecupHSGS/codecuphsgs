"use client"; 

import { ReactNode, useContext, useEffect } from "react";
import SectionHeader from "../utils/sectionHeader";
import { useLayoutEffect, useState } from "react";
import { createContext } from "react";
import { ContestInfo, getAllContests } from "@/backend_api/contests";
import alertBackendAPIError from "@/app/utils/alertSystem/alertBackendAPIError";
import { retrieveUserInfo } from "@/session_storage_api/api";
import { userInfoContext } from "../layout";
import SubsectionBodyContainer from "../utils/subsectionBodyContainer";

const sectionTabs = [
    {
        href:"/dashboard/contests/upcoming", 
        title:"Upcoming", 
        adminRequired:false, 
    }, 
    {
        href:"/dashboard/contests/ongoing" , 
        title:"Ongoing", 
        adminRequired:false, 
    }, 
    {
        href:"/dashboard/contests/past", 
        title:"Past", 
        adminRequired:false, 
    }, 
    {
        href:"/dashboard/contests/create", 
        title:"Create", 
        adminRequired:true, 
    }
]

const ContestsInfoContext = createContext<ContestInfo[] | null>(null); 

export default function ContestsLayout({
    children
}: { 
    children: ReactNode
}) { 

    /* put the contestsInfo here to reduce the number of fetch request. 
    Persist until rerender contest page / reload */
    const [contestsInfo, setContestsInfo] = useState<ContestInfo[] | null> (null); 
    const userInfo = useContext(userInfoContext); 

    async function refetchContestsInfo() { 
        try { 
            const newContestsInfo = await getAllContests(); 
            setContestsInfo(newContestsInfo); 
        }
        catch(error) { 
            alertBackendAPIError(error, "contestInfoRefetcher"); 
        }
    }

    useEffect(() => { 
        refetchContestsInfo(); 
    }, []); 

    if(contestsInfo == null) { 
        return null; 
    }

    if(userInfo == null) { 
        return null; 
    }

    const sectionTabsFiltered = sectionTabs.filter((sectionTab) => { 
        if(sectionTab.adminRequired && userInfo.userIsAdmin !== true) { 
            return false; 
        }
        return true;    
    }); 

    return (
        <ContestsInfoContext.Provider value={contestsInfo}>
            <SectionHeader sectionTabs={sectionTabsFiltered}></SectionHeader>
            <SubsectionBodyContainer>{children}</SubsectionBodyContainer>
        </ContestsInfoContext.Provider>
    )
}

export { 
    ContestsInfoContext
}