"use client"; 

import { ReactNode } from "react";
import SectionHeader from "../components/sectionHeader";
import { useLayoutEffect, useState } from "react";
import { createContext } from "react";
import { ContestInfo, getAllContests } from "@/backend_api/contests";
import alertBackendAPIError from "@/app/utils/alertSystem/alertBackendAPIError";
import { getUserInfo } from "@/session_storage_api/api";

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
    const userInfo = getUserInfo(); 

    const sectionTabsFiltered = sectionTabs.filter((sectionTab) => { 
        if(sectionTab.adminRequired && userInfo?.userIsAdmin == false) { 
            return false; 
        }
        return true; 
    }); 
    
    async function refetchContestsInfo() { 
        try { 
            const contestsInfo = await getAllContests(); 
            setContestsInfo(contestsInfo); 
        }
        catch(error) { 
            alertBackendAPIError(error, "contestInfoRefetcher"); 
        }
    }

    useLayoutEffect(() => { 
        try { 
            refetchContestsInfo(); 
        } catch(error) { 
            alert(error); 
        }
    }, []); 

    return (
        contestsInfo !== null? 
            <ContestsInfoContext.Provider value={contestsInfo}>
                <SectionHeader sectionTabs={sectionTabsFiltered}></SectionHeader>
                <div className="w-full text-sm p-6">{children}</div>
            </ContestsInfoContext.Provider>: 
            <div>Loading...</div>
    )
}

export { 
    ContestsInfoContext
}