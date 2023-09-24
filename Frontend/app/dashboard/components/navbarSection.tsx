"use client"; 

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
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
            className="h-20 w-full flex justify-center items-center hover:bg-gray-100 hover:text-black duration-300">
            <Link href={href}>{children}</Link>
        </button>
    ); 
}