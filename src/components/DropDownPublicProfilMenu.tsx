"use client"
import { useUserInfos } from '@/context/UserInfosContext'
import { Home, LogOut, ShoppingCart } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { type Session } from "next-auth";

export default function DropDownPublicProfilMenu({ session }: { session: Session | null }) {
    const { userInfos, isLoadingUserInfos } = useUserInfos();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const ProfileHeaderNavs = [
        { label: "home", icon: Home, href: "" },
        { label: "cart", icon: ShoppingCart, href: "cart" },
    ];
  return (
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
  )
}
