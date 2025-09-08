"use client"
import { useUserInfos } from '@/context/UserInfosContext'
import { ChevronsUpDown, Home, LogOut, ShoppingCart } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { type Session } from "next-auth";

export default function DropDownPublicProfilMenu({ session }: { session: Session | null }) {
    const { userInfos, isLoadingUserInfos } = useUserInfos();
    const ProfileHeaderNavs = [
        { label: "home", icon: Home, href: "" },
        { label: "cart", icon: ShoppingCart, href: "cart" },
    ];
    const DropDownProfileRef = useRef<HTMLDivElement | null>(null);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
    useEffect(() => {
        const hideMenuRef = (e: MouseEvent) => {
            if(DropDownProfileRef.current && !DropDownProfileRef.current.contains(e.target as Node)){
                setIsProfileMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", hideMenuRef);
        return () => document.removeEventListener("mousedown", hideMenuRef);
    },[isProfileMenuOpen])
    return (
        <div
            ref={DropDownProfileRef}
            className="relative"
        >
            <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="p-1.5 font-semibold
                    flex items-center gap-3 rounded-lg
                    border border-neutral-700 bg-neutral-800
                    hover:bg-neutral-900 text-white
                    cursor-pointer transition-colors"
            >
                <div
                className='relative w-7 h-7'
                >
                    {(userInfos?.profileimage || session?.user?.image) && (
                        <Image
                            src={userInfos?.profileimage || session?.user?.image as string}
                            alt={userInfos?.fullname || "User avatar"}
                            fill
                            className="object-cover overflow-hidden rounded-full 
                                ring-2 border-2 border-neutral-900 ring-purple-600"
                        />
                        )}
                    <span
                        className="absolute w-2 h-2 rounded-full bg-green-500 right-0 bottom-0 border-1 border-white"
                    />
                </div>
                <span className="text-sm font-medium text-white">
                    {isLoadingUserInfos ? (<span className="animate-pulse w-24 h-3 bg-gray-700 flex rounded-md" />) : userInfos?.fullname}
                </span>
                <ChevronsUpDown size={16} className="text-white"/>
            </button>
            {/* Dropdown Menu (Conceptual) */}
            <div 
                className={`absolute right-0 top-14 w-64 bg-white 
                    border border-gray-200 rounded-lg shadow-lg 
                    z-50 overflow-hidden
                    ${isProfileMenuOpen 
                        ? "opacity-100 max-h-100 overflow-hidden"
                        : "opacity-0 max-h-0 overflow-hidden pointer-events-none"}
                    transition-all duration-200`}
                    >
            <div className="w-full py-2 px-3 border-b border-gray-200">
                {isLoadingUserInfos ? (
                    <div className="w-full flex items-center gap-3">
                        <span className="w-10 h-10 rounded-lg bg-gray-300 animate-pulse"/>
                        <span className="flex flex-col gap-2">
                            <span className="w-24 h-3 bg-gray-300 rounded-md animate-pulse"/>
                            <span className="w-20 h-3 bg-gray-300 rounded-md animate-pulse"/>
                        </span>
                    </div>
                ) : (
                    <div className="w-full flex items-center gap-3">
                        <div
                            className='relative w-8 h-8'
                        >
                            <Image
                                src={userInfos?.profileimage || session?.user?.image || ""}
                                alt={userInfos?.fullname || ""}
                                fill
                                className="object-cover overflow-hidden rounded-full 
                                    ring-2 border-2 border-2-800 ring-purple-600"
                            />
                            <span
                                className="absolute w-3 h-3 rounded-full bg-green-500 right-0 bottom-0 border-2 border-white"
                            />
                        </div>
                        <span className="flex flex-col gap-0.5">
                            <h1 className="text-sm font-semibold text-gray-900 capitalize">
                                {userInfos?.fullname}
                            </h1>
                            <span className="text-xs text-gray-500">
                                {userInfos?.email}
                            </span>
                        </span>
                    </div>
                )}
            </div>
                <div
                    className="flex flex-col p-2"
                >
                    {ProfileHeaderNavs.map((item, idx) => {
                        return (
                            <Link
                                key={idx}
                                prefetch
                                onClick={() => setIsProfileMenuOpen(false)}
                                href={`/${userInfos?.UserRole === "affiliate" ? "affiliate" : "seller"}/${item.href.toLowerCase().replace(" ", "")}`}
                                className="group capitalize flex items-center gap-3 px-2 py-2 
                                    rounded-lg text-sm
                                    text-gray-800 hover:bg-gray-100 transition-colors">
                                <item.icon size={16} className="text-gray-500"/>
                                {item.label}
                            </Link>
                        )
                    })}
                </div>
                <button
                    className="text-sm text-red-600 w-full
                        hover:bg-red-50 transition-colors
                        flex items-center gap-3 px-3 py-2 
                        justify-center cursor-pointer
                        border-t border-gray-100"
                    onClick={() => signOut({ callbackUrl: '/auth/login' })}
                >
                    <LogOut 
                        size={16} 
                        className="text-red-500"
                    />
                    Log Out
                </button>
            </div>
        </div>
    )
}
