"use client"; 

import { useContext } from "react"
import { ContestsInfoContext } from "../layout";
import ContestTable from "../components/contestTable";

export default function OngoingContests() { 
    const contestsInfo = useContext(ContestsInfoContext)

    if(contestsInfo === null) { 
        return <>Loading...</>; 
    }
    const ongoingContestsInfo = 
        contestsInfo
            .filter(contestsInfo => contestsInfo.startDate < new Date() && contestsInfo.endDate >= new Date())
    
    return (
        <div className="w-full overflow-auto">
            <ContestTable contestList={ongoingContestsInfo}/>
        </div>
    )
}

