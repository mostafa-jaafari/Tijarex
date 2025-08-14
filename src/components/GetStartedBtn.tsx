"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";



export function GetStartedBtn(){
    const CTA_Buttons = [
        {
            label: "Login",
            href: "/auth/login"
        },
        {
            label: "Join Us",
            href: "/auth/onboarding"
        },
    ];
    const [isOpen, setIsOpen] = useState(false);
    const MenuRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const hideMenuRef = (e: MouseEvent) => {
            if(MenuRef.current && !MenuRef.current.contains(e.target as Node)){
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", hideMenuRef);
        return () => document.removeEventListener("mousedown", hideMenuRef);
    },[])
    return (
        <div
            className="relative"
            ref={MenuRef}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-sm 
                    py-1 px-3 rounded-full primary-button"
            >
                Get Started <ChevronDown size={14} />
            </button>
            {isOpen && (
                <div
                    className="absolute right-0 top-full text-sm 
                        bg-gray-50 rounded w-full shadow-sm mt-2 
                        flex flex-col overflow-hidden"
                >
                    {CTA_Buttons.map((btn, idx) => {
                        return (
                            <Link
                                href={btn.href}
                                key={idx}
                                onClick={() => setIsOpen(false)}
                                className="text-center py-1 px-3 hover:bg-gradient-to-r 
                                    from-black to-black/80 hover:text-white
                                    cursor-pointer"
                            >
                                {btn.label}
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}