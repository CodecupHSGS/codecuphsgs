"use client"; 

import Link from "next/link";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
export default function NavBarSection({
    href, children
}: { 
    href: string, 
    children: React.ReactNode
}): JSX.Element { 
    const router = useRouter(); 

    function onClicked() { 
        router.push(href);
    }

    return (
        <button 
            onClick={onClicked}
            className="h-20 w-full flex justify-center items-center hover:bg-gray-100 hover:text-black">
            {children}
        </button>
    ); 
}