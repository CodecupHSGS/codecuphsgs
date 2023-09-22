"use client"; 

import { useContext } from "react"
import { ContestsInfoContext } from "../layout";
import ContestTable from "../components/contestTable";

export default function UpcomingContests() { 
    const contestsInfo = useContext(ContestsInfoContext); 
    if(contestsInfo === null) { 
        return <>Loading...</>; 
    }
    const upcomingContests = contestsInfo.filter(contestsInfo => contestsInfo.startDate >= new Date())
    
    console.log(contestsInfo); 
    return (
        <div className="w-full">
            <ContestTable contestList={upcomingContests}/>
        </div>
    )
}

