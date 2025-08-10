"use client";
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import { Home, Menu, User, LayoutDashboard, Settings } from "lucide-react";

export function ShowHeaderMenu() {
    const MenuDropDown = [
        { label: "home", href: "/", icon: Home },
        { label: "profile", href: "/", icon: User },
        { label: "dashboard", href: "/", icon: LayoutDashboard },
        { label: "settings", href: "/", icon: Settings },
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
                className="flex text-teal-600 hover:text-teal-500 p-1 cursor-pointer"
            >
                <Menu size={20} />
            </span>

            <div
                className={`
                    absolute right-0 top-full mt-2 min-w-[220px]
                    flex flex-col items-start bg-white rounded-xl
                    border border-gray-100 shadow p-1
                    transform transition-all duration-200 origin-top-right
                    ${isShowMenu 
                        ? "opacity-100 scale-y-100 scale-x-100 translate-y-0" 
                        : "opacity-0 scale-y-0 scale-x-0 -translate-y-2 pointer-events-none"
                    }
                `}
            >
                {MenuDropDown.map((item, idx) => (
                    <Link
                        key={idx}
                        href={item.href}
                        className="w-full py-1.5 px-2 rounded-lg flex items-center gap-2 hover:bg-teal-50 hover:text-gray-700"
                    >
                        <item.icon size={20} /> {item.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}
