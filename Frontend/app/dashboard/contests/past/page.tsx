"use client"; 

import { ContestInfo } from "@/backend_api/contests"
import { useContext } from "react"
import Link from "next/link"
import { ContestsInfoContext } from "../layout";
import assert from "assert";
import ContestTable from "../components/contestTable";

export default function PastContests() { 
    const contestsInfo = useContext(ContestsInfoContext)

    const pastContests = contestsInfo
                            .filter(contestsInfo => contestsInfo.endDate < new Date()); 

    console.log("contestsInfo: "); 
    console.log(contestsInfo); 
    try {
        assert (contestsInfo != null); 
        console.log(contestsInfo); 
        return (
            <div className="w-full">
                <ContestTable contestList={pastContests}/>
            </div>
        )
    }
    catch (error) { 
        console.log(contestsInfo)
        console.log(error); 
        return <>Loading...</>; 
    }
}

