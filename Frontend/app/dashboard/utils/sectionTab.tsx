
import { retrieveUserInfo } from "@/session_storage_api/api"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface SectionTabData{ 
    href: string, 
    title: string, 
    adminRequired: boolean
}

export default function SectionTab({ 
    sectionTab, 
    selected, 
}: { 
    sectionTab: SectionTabData, 
    selected: boolean, 
}): JSX.Element { 
    const router = useRouter(); 
    const onButtonClicked = () => { 
        console.log(sectionTab.href)
        router.push(sectionTab.href); 
    }
    return (
        <button 
            onClick={onButtonClicked} 
            className={`group/sectionTab h-full flex items-center justify-center ${selected? "bg-white rounded-t-md": "bg-gray-100 hover:bg-gray-50 hover:rounded-t-md"}  text-sm`}>
                {sectionTab.title}
        </button>
    )
}

export type { 
    SectionTabData
}