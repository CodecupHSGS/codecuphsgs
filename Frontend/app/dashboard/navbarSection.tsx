"use client"; 

import Link from "next/link";
export default function NavBarSection({
    href, children
}: { 
    href: string, 
    children: React.ReactNode
}): JSX.Element { 
    return (
        <div className="h-20 w-full flex flex-row justify-center items-center  leading-6 hover:font-semibold hover:underline hover:underline-offset-8">
            <Link href={href}
            >
                {children}
            </Link>
        </div>
    ); 
}