"use client"; 

import { ContestInfo } from "@/backend_api/contests"
import { useState, useEffect, useContext } from "react"
import Link from "next/link"
import { displayMili } from "../helper"
import { ContestsInfoContext } from "../layout";
import assert from "assert";
import ContestTable from "../components/contestTable";

function OngoingContest({
    contestInfo
}: { 
    contestInfo: ContestInfo
}): JSX.Element {

    return (
        <div className="min-w-0 flex gap-x-4">
            <Link href={`/dashboard/contest/${contestInfo.contestId}`}
                className="text-sm underline font-semibold leading-6 text-gray-900">
                {contestInfo.contestName}
            </Link>
            <p></p>
        </div>
    )
}

export default function OngoingContests() { 
    const contestsInfo = useContext(ContestsInfoContext)

    if(contestsInfo === null) { 
        return <>Loading...</>; 
    }
    const ongoingContestsInfo = 
        contestsInfo
            .filter(contestsInfo => contestsInfo.startDate < new Date() && contestsInfo.endDate >= new Date())
    try {
        assert (contestsInfo != null); 
        return (
            <div>
                <ContestTable contestList={ongoingContestsInfo}/>
            </div>
        )
    }
    catch (error) { 
        console.log(contestsInfo)
        console.log(error); 
        return <>Error!</>; 
    }
}

