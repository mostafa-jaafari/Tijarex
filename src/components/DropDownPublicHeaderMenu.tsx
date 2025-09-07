"use client";
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import { Home, Menu, User, JoystickIcon } from "lucide-react";

export function DropDownPublicHeaderMenu() {
    const MenuDropDown = [
        { label: "home", href: "/", icon: Home },
        { label: "join us", href: "/", icon: JoystickIcon },
        { label: "login", href: "/", icon: User },
    ];

    const MenuRef = useRef<HTMLSpanElement | null>(null);
    const [isShowMenu, setIsShowMenu] = useState(false);

    useEffect(() => {
        const hideMenuRef = (e: MouseEvent) => {
            if (MenuRef.current && !MenuRef.current.contains(e.target as Node)) {
                setIsShowMenu(false);
            }
        };
        document.addEventListener("mousedown", hideMenuRef);
        return () => document.removeEventListener("mousedown", hideMenuRef);
    }, []);

    return (
        <div className="">
            <span
                ref={MenuRef}
                onClick={() => setIsShowMenu(!isShowMenu)}
                className="flex hover:text-black/50 p-1 cursor-pointer"
            >
                <Menu size={20} />
            </span>

            <div
                className={`
                    absolute right-6 top-full w-[180px]
                    flex flex-col items-start bg-white rounded-xl
                    border border-gray-100 shadow p-1 mt-1
                    transform transition-all duration-200 origin-top-right
                    ${isShowMenu 
                        ? "opacity-100 max-h-64 overflow-hidden"
                        : "opacity-0 max-h-0 overflow-hidden pointer-events-none"
                    }
                `}
            >
                {MenuDropDown.map((item, idx) => (
                    <Link
                        key={idx}
                        href={item.href}
                        className="w-full py-1.5 px-2 rounded-lg flex 
                            items-center gap-2 hover:bg-purple-100
                            hover:text-neutral-700 capitalize text-sm"
                    >
                        <item.icon size={18} /> {item.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}
