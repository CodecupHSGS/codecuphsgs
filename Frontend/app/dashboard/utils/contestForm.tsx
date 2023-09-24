import { ContestFormat, ContestInfo, JudgeMode } from "@/backend_api/contests";
import { FormEvent, useState } from "react";
import { JsxElement } from "typescript";


import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const getEnumKeys = <T extends Object>(enumToDeconstruct: T): Array<keyof typeof enumToDeconstruct> => {
    return Object.keys(enumToDeconstruct) as Array<keyof typeof enumToDeconstruct>;
  };

console.log(getEnumKeys(ContestFormat)); 

export default function ContestInfoForm({callback, contestInfo}: {callback: Function, contestInfo: ContestInfo | null}): JSX.Element {
    const [name, setName] = useState(contestInfo?.contestName); 
    const [overview, setOverview] = useState(contestInfo?.overview); 
    const [startDate, setStartDate] = useState(contestInfo?.startDate);
    const [endDate, setEndDate] = useState(contestInfo?.endDate);
    const [contestFormat, setContestFormat] = useState(contestInfo?.contestFormat); 
    const [gameId, setGameId] = useState(contestInfo?.gameId); 
    const [trialJudge, setTrialJudge] = useState(contestInfo?.trialJudge); 
    const [judgeMode, setJudgeMode] = useState(contestInfo?.judgeMode); 
    
    function onNameChange(event: FormEvent) { 
        const target = event.target as HTMLInputElement; 
        setName(target.value); 
    }

    function onOverviewChange(event: FormEvent) { 
        const target = event.target as HTMLInputElement; 
        setName(target.value); 
    }

    function onContestFormatSelect(event: FormEvent) { 
        const target = event.target as HTMLSelectElement; 
        setContestFormat(ContestFormat[target.value as keyof typeof ContestFormat]); 
    }

    function onJudgeModeSelect(event: FormEvent) { 
        const target = event.target as HTMLSelectElement; 
        console.log(target.value); 
        console.log(JudgeMode[target.value as keyof typeof JudgeMode]); 
        setJudgeMode(JudgeMode[target.value as keyof typeof JudgeMode]); 
    }

    function onTrialJudgeSelect(event: FormEvent) { 
        const target = event.target as HTMLSelectElement; 
        setTrialJudge(target.value === 'yes'? true: false); 
    }

    function onSubmitClicked(event: FormEvent) { 
         event.preventDefault();

        callback({
            name, 
            overview,
            gameId, 
            startDate, 
            endDate, 
            contestFormat,
            judgeMode,  
            trialJudge, 
        }); 
    }

    function onGameIdChanged(event: FormEvent) { 
        const target = event.target as HTMLInputElement; 
        setGameId(parseInt(target.value))
    }
      
    return (
    <form>
        <div className="space-y-12">
            <div className="border-b border-gray-900 pb-12 space-y-4">
                <h2 className="text-base font-semibold leading-7 text-gray-900">General Information</h2>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium leading-6 text-gray-900">Name</label>
                    <div className="mt-2">
                        <input type="text" onChange={onNameChange} className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6">
                            {contestInfo?.contestName}
                        </input>
                    </div>
                </div>

                <div className="col-span-full">
                    <label className="block text-sm font-medium leading-6 text-gray-900">Overview</label>
                    <div className="mt-2">
                        <textarea onChange={onOverviewChange} className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6">
                            {contestInfo?.overview}
                        </textarea>
                    </div>
                </div>

                <div className="sm:col-span-3">
                    <label  className="block text-sm font-medium leading-6 text-gray-900">Time</label>
                    <div className="mt-2 flex gap-x-6">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker 
                                label="Start time" 
                                value={contestInfo?.startDate}
                                onChange={newDate => {
                                    if(newDate != null) { 
                                         setStartDate(newDate); 
                                    }
                                }}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker 
                                label="End time" 
                                value={contestInfo?.endDate}
                                onChange={newDate => {
                                    if(newDate != null) { 
                                         setEndDate(newDate)
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </div>
                </div>
                <div className="sm:col-span-3">
                    <label  className="block text-sm font-medium leading-6 text-gray-900">Game ID</label>
                    <div className="mt-2">
                        <input type="text" onChange={onGameIdChanged} name="last-name" id="last-name" className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6">
                            {contestInfo?.gameId}
                        </input>
                    </div>
                </div>
                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium leading-6 text-gray-900">Contest Format</label>
                    <select onChange={onContestFormatSelect}>
                        <option value='ALL_VS_ALL'>Pairwise matches</option>    
                        <option value='ROUND_16'>Round 16</option>
                    </select>
                </div>
                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium leading-6 text-gray-900">Judge Mode</label>
                    <select onChange={onJudgeModeSelect}>
                        <option value='MANUAL_JUDGE'>Judge manually</option>
                        <option value='AUTO_JUDGE'>Judge automatically</option>
                    </select>
                </div>
                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium leading-6 text-gray-900">Run trial matches during the contest?</label>
                    <select onChange={onTrialJudgeSelect}>
                        <option value='yes'>Yes</option>
                        <option value='no'>No</option>
                    </select>
                </div>
            </div>
        </div>
        <div className="mt-6 flex items-center justify-center gap-x-6">
            {/* <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button> */}
            <button type="submit" onClick = {onSubmitClicked} className="rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">Create Contest</button>
        </div>
    </form>
    )
}