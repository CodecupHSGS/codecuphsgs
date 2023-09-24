import { FormEvent, useState } from "react"

export default function SubmissionFilter({
    onIncludeUnofficialFlipped
}: { 
    onIncludeUnofficialFlipped: () => void
}) { 
    const [includeUnofficial, setIncludeUnofficial] = useState(true); 

    function onCheckBoxChanged() { 
        onIncludeUnofficialFlipped(); 
        setIncludeUnofficial((value) => !value); 
    }

    return (
        <form className="w-full p-4">
            <label>
                <input type="checkbox" checked={includeUnofficial} onChange={onCheckBoxChanged}/>
                    &nbsp;
                Include unofficial submissions? 
            </label>
        </form>
    )
}