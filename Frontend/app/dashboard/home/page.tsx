"use client"; 

import { useContext } from "react"
import { userInfoContext } from "../layout"

export default function Home() { 
    const userInfo = useContext(userInfoContext); 

    if(userInfo?.userId == null) { 
        return (
            <div className="p-12 space-y-4">
                <h1>Welcome!</h1>
                <div>CodecupHSGS is a platform for hosting PvP programming contests.</div>
                <div>Head to {<a href="/dashboard/contests" className="underline"> contests</a>} and see if you can create a program that beats other users in a bot-vs-bot match! </div>
            </div>
        )
    }
    return <div>Welcome back, {userInfo.username}!</div>
}