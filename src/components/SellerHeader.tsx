"use client";
import { ArrowRightLeft, Bell, ChevronDown, CreditCard, DollarSign, FileClock, LogOut, Warehouse } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LayoutDashboard, Package, ShoppingCart, RotateCcw } from "lucide-react";
import { Session } from "next-auth";
import { useUserInfos } from "@/context/UserInfosContext";


export function SellerHeader({ session }: { session: Session | null }){
    const ProfileHeaderNavs = [
        { label: "dashboard", icon: LayoutDashboard, href: "" },
        { label: "profile", icon: Package, href: "profile" },
        { label: "orders", icon: ShoppingCart, href: "orders" },
        { label: "my store", icon: RotateCcw, href: "my-store" },
    ];

    const Balance_Links = [
        {
            label: "My balance purchases",
            href: "/seller",
            icon: FileClock,
            iconstyles: "text-orange-400"
        },{
            label: "All transactions",
            href: "/seller",
            icon: ArrowRightLeft,
            iconstyles: "text-green-600"
        },{
            label: "My withdrawls",
            href: "/seller/my-withdraw",
            icon: Warehouse,
            iconstyles: "text-yellow-500"
        },
    ];
    
    const DropDownProfileRef = useRef<HTMLDivElement | null>(null)
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

    const DropDownNotifsRef = useRef<HTMLDivElement | null>(null)
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    useEffect(() => {
        const hideMenuRef = (e: MouseEvent) => {
            if(DropDownNotifsRef.current && !DropDownNotifsRef.current.contains(e.target as Node)){
                setIsNotificationsOpen(false);
            }
        }
        document.addEventListener("mousedown", hideMenuRef);
        return () => document.removeEventListener("mousedown", hideMenuRef);
    },[isNotificationsOpen]);
    
    // DropDown balance
    const DropDownBalanceRef = useRef<HTMLDivElement | null>(null)
    const [isBalanceOpen, setIsBalanceOpen] = useState(false);
    useEffect(() => {
        const hideMenuRef = (e: MouseEvent) => {
            if(DropDownBalanceRef.current && !DropDownBalanceRef.current.contains(e.target as Node)){
                setIsBalanceOpen(false);
            }
        }
        document.addEventListener("mousedown", hideMenuRef);
        return () => document.removeEventListener("mousedown", hideMenuRef);
    },[]);

    const { isLoadingUserInfos, userInfos } = useUserInfos();
    return (
        <section
            className="sticky top-0 w-full flex items-center 
                justify-between bg-[#1A1A1A] shadow
                z-50 py-2.5 px-6 borderb border-gray-200"
        >
            {/* --- Logo --- */}
            <Link href="/seller" className="flex items-center gap-2">
                    <div className="relative w-8 h-8">
                        <Image 
                            src="/LOGO1.png"
                            alt="Tijarex-Logo.png"
                            fill
                            className="object-contain"
                            quality={100}
                            priority
                        />
                    </div>
                    <span className="text-xl font-semibold text-white">Tijarex</span>
                </Link>
            <div className="flex items-center gap-4">
                {/* --- Balance --- */}
            <div
                ref={DropDownBalanceRef}
                className="relative"
            >
                <button
                    onClick={() => setIsBalanceOpen(!isBalanceOpen)}
                    className={`px-2 py-1 font-semibold
                        flex items-center gap-3 rounded-lg
                        border border-neutral-700 bg-neutral-800
                        hover:bg-neutral-900 text-white
                        cursor-pointer transition-colors
                        `}
                >
                    <DollarSign 
                        size={18} 
                        className="text-green-500"/> {isLoadingUserInfos ? (<span className="w-14 h-4 rounded-full flex bg-green-700/50 animate-pulse"/>) : userInfos?.totalbalance} Dh <ChevronDown size={16} className={`text-gray-400 ${isBalanceOpen && "rotate-180 transition-all duration-200 ease-in"}`} />
                </button>
                <div 
                    className={`absolute overflow-hidden right-0 
                        mt-4 w-68 rounded-lg shadow-sm
                        bg-gradient-to-r from-neutral-100 to-white
                        border border-neutral-300 shadow-sm animate-fade-in
                        transition-all duration-200
                        ${isBalanceOpen 
                            ? "opacity-100 max-h-100 overflow-hidden opacity-100"
                            : "opacity-0 max-h-0 overflow-hidden pointer-events-none"
                        }`}
                    >
                    <div
                        className="w-full
                            bg-gradient-to-r from-[#1A1A1A] via-neutral-800 
                            to-[#1A1A1A]"
                    >
                        <div
                            className="w-full p-3 flex items-center justify-between"
                        >
                            <span className="flex flex-col gap-1">
                                <h1 
                                    className="flex items-center gap-1 capitalize 
                                        text-gray-400"
                                >
                                    <span 
                                        className="w-2 h-2 bg-green-400 flex 
                                            rounded-full animate-pulse"
                                    />
                                    Total Balance
                                </h1>
                                <b 
                                    className="text-3xl flex items-center text-white">
                                        {isLoadingUserInfos ? 
                                            (
                                                <span 
                                                    className="w-14 h-4 rounded-full flex bg-green-700/50 
                                                        animate-pulse"/>
                                            )
                                            :
                                            userInfos?.totalbalance} Dh</b>
                            </span>
                            <span
                                className="text-green-600 h-max 
                                    flex rounded-lg shadow bg-white p-1"
                            >
                                <CreditCard size={24} />
                            </span>
                        </div>
                    </div>
                    <div
                        className="flex flex-col gap-2 p-2"
                    >
                        {Balance_Links.map((item, idx) => {
                            return (
                                <Link 
                                    key={idx}
                                    onClick={() => setIsBalanceOpen(false)}
                                    href={item.href}
                                    className="group flex items-center gap-3
                                        hover:bg-gray-200 hover:text-black
                                        px-2 py-1 rounded-lg text-gray-600"
                                >
                                    <span 
                                        className={`bg-white shadow p-2 rounded-lg 
                                        group-hover:text-green-600 
                                        ${item.iconstyles}`}>
                                            <item.icon 
                                        size={16}
                                    />
                                    </span>
                                    <h1>
                                        {item.label}
                                    </h1>
                                </Link>
                            )
                        })}
                    </div>
                    <div
                        className="w-full flex justify-center p-2"
                    >
                        <Link
                            href="/seller/add-balance"
                            className={`w-full text-center justify-center
                                bg-gradient-to-r from-[#1A1A1A] via-neutral-800 to-[#1A1A1A]
                                capitalize text-white
                                shadow-sm
                                hover:from-[#1A1A1A] hover:via-neutral-900 hover:to-black
                                py-1.5 rounded-lg transition-colors`}
                        >
                            Add balance
                        </Link>
                    </div>
                </div>
            </div>
            {/* Notifications */}
            <div 
                ref={DropDownNotifsRef} 
                className="relative"
            >
                {/* Bell Icon with Badge */}
                <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="relative p-2 rounded-full hover:bg-teal-900 
                        cursor-pointer transition-colors"
                >
                    <Bell 
                        size={20} 
                        className="text-white"
                    />
                    <span 
                        className="absolute -top-1 -right-1 text-teal-600 
                            bg-white font-semibold text-xs rounded-full 
                            px-1"
                    >
                    3
                    </span>
                </button>

                {/* Dropdown Menu */}
                <div 
                    className={`absolute overflow-hidden right-0 mt-4
                        w-72 bg-white rounded-xl shadow-lg border 
                        border-gray-200 animate-fade-in
                        ${isNotificationsOpen 
                            ? "opacity-100 max-h-100 overflow-hidden opacity-100"
                            : "opacity-0 max-h-0 overflow-hidden pointer-events-none"}
                        transition-all duration-200`}
                    >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200">
                    <span className="text-sm font-semibold">
                        Notifications
                    </span>
                    <button className="text-xs text-blue-600 hover:underline">
                        Mark all as Read
                    </button>
                </div>

                {/* Notification List */}
                <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                    <li className="flex items-start px-4 py-3 hover:bg-gray-50 cursor-pointer transition">
                    <span className="mr-3 text-blue-500">
                        <Bell size={16} />
                    </span>
                    <div>
                        <p className="text-sm text-gray-700">New order received</p>
                        <span className="text-xs text-gray-400">2 min ago</span>
                    </div>
                    </li>
                    <li className="flex items-start px-4 py-3 hover:bg-gray-50 cursor-pointer transition">
                    <span className="mr-3 text-yellow-500">⚠️</span>
                    <div>
                        <p className="text-sm text-gray-700">Stock running low</p>
                        <span className="text-xs text-gray-400">10 min ago</span>
                    </div>
                    </li>
                    <li className="flex items-start px-4 py-3 hover:bg-gray-50 cursor-pointer transition">
                    <span className="mr-3 text-green-500">👤</span>
                    <div>
                        <p className="text-sm text-gray-700">New user registered</p>
                        <span className="text-xs text-gray-400">30 min ago</span>
                    </div>
                    </li>
                </ul>

                {/* Footer */}
                <div className="p-2 text-center text-blue-600 text-sm hover:bg-gray-50 cursor-pointer">
                    view All
                </div>
                </div>
            </div>
            <span 
                className="border-r border-gray-200 h-6 flex"
            />
            <div
                ref={DropDownProfileRef}
                className="relative"
            >
                <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 cursor-pointer 
                        rounded-lg"
                >
                    <div
                    className='relative w-10 h-10'
                    >
                    <Image
                        src={userInfos?.profileimage || session?.user?.image || ""}
                        alt={session?.user?.name || ""}
                        fill
                        className="object-cover overflow-hidden rounded-full border-2 border-green-500"
                    />
                    <span
                        className="absolute w-3 h-3 rounded-full bg-green-500 right-0 bottom-0 border-2 border-white"
                    />
                    </div>
                    <div className="flex flex-col items-start leading-tight">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">
                        {isLoadingUserInfos ? (<span className="animate-pulse w-24 h-3 bg-gray-700 flex rounded-md" />) : userInfos?.fullname}
                        </span>
                        <ChevronDown size={16} className="text-gray-400" />
                    </div>
                    <span className="text-xs text-gray-400">
                        {session?.user?.email}
                    </span>
                    </div>
                </button>
                {/* Dropdown Menu (Conceptual) */}
                <div 
                    className={`absolute right-0 top-14 w-52 bg-white 
                        border border-gray-200 rounded-lg shadow-lg 
                        z-50 overflow-hidden
                        ${isProfileMenuOpen 
                            ? "opacity-100 max-h-100 overflow-hidden opacity-100"
                            : "opacity-0 max-h-0 overflow-hidden pointer-events-none"}
                        transition-all duration-200`}
                        >
                    {/* Example Dropdown Items */}
                    {ProfileHeaderNavs.map((item, idx) => {
                        return (
                            <Link
                                key={idx}
                                onClick={() => setIsProfileMenuOpen(false)}
                                href={`/seller/${item.href.toLowerCase().replace(" ", "")}`}
                                className="capitalize flex items-center gap-3 px-3 py-2 text-sm
                                    text-gray-800 hover:bg-gray-100 transition-colors">
                                <item.icon size={16} className="text-gray-500"/>
                                {item.label}
                            </Link>
                        )
                    })}
                    <button
                        className="text-sm text-red-600 w-full text-left
                            hover:bg-red-50 transition-colors
                            flex items-center gap-3 px-3 py-1.5 
                            cursor-pointer"
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
            </div>
        </section>
    )
}