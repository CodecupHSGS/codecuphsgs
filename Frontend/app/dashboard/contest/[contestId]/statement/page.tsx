"use client"; 

import { useParams } from "next/navigation";
import { contestDetailsContext } from "../layout";
import { useContext } from "react";

export default function ContestStatement() { 
    const params = useParams(); 
    const contestDetails = useContext(contestDetailsContext); 

    return <div className="">You can read the statement <a className="underline" href={contestDetails?.gameStatementUrl}>here</a></div>
}