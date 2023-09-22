"use client"; 

import { useContext } from "react"
import { ContestsInfoContext } from "../layout";
import ContestTable from "../components/contestTable";

export default function PastContests() { 
    const contestsInfo = useContext(ContestsInfoContext)

    if(contestsInfo === null) { 
        return <>Loading...</>; 
    }
    
    const pastContests = contestsInfo
                            .filter(contestsInfo => contestsInfo.endDate < new Date()); 

    return (
        <div className="w-full">
            <ContestTable contestList={pastContests}/>
        </div>
    )
}

