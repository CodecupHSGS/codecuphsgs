"use client"; 

import { ContestInfo } from "@/backend_api/contests"
import { useState, useEffect, useContext } from "react"
import Link from "next/link"
import { displayMili } from "../helper"
import { ContestsInfoContext } from "../layout";
import assert from "assert";
import ContestTable from "../components/contestTable";

export default function UpcomingContests() { 
    const contestsInfo = useContext(ContestsInfoContext); 
    if(contestsInfo === null) { 
        return <>Loading...</>; 
    }
    const upcomingContests = contestsInfo.filter(contestsInfo => contestsInfo.startDate >= new Date())
    try {
        assert (contestsInfo != null); 
        console.log(contestsInfo); 
        return (
            <div className="w-full">
                <ContestTable contestList={upcomingContests}/>
            </div>
        )
    }
    catch (error) { 
        console.log(contestsInfo)
        console.log(error); 
        return <>Loading...</>; 
    }
}

