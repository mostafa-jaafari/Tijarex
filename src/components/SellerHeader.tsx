"use client";
import { ArrowRightLeft, Bell, ChevronDown, CreditCard, DollarSign, FileClock, Warehouse } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LayoutDashboard, Package, ShoppingCart, RotateCcw } from "lucide-react";
import { Session } from "next-auth";
import { useTranslations } from "next-intl";
import { useUserInfos } from "@/context/UserInfosContext";

export function SellerHeader({ session }: { session: Session | null }){
    const t = useTranslations();
    const ProfileHeaderNavs = [
        { label: t("profiledropdown.dashboard"), icon: LayoutDashboard, href: "dashboard" },
        { label: t("profiledropdown.products"), icon: Package, href: "products" },
        { label: t("profiledropdown.orders"), icon: ShoppingCart, href: "orders" },
        { label: t("profiledropdown.returns"), icon: RotateCcw, href: "returns" },
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
            href: "/seller",
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
    },[isBalanceOpen]);

    const { isLoadingUserInfos, userInfos } = useUserInfos();
    return (
        <section
            className="sticky top-0 w-full flex items-center 
                justify-between bg-white shadow
                z-50 py-1.5 px-6 borderb border-gray-200"
        >
            <div className="grow"></div>
            <div className="flex items-center gap-4">
                {/* --- Balance --- */}
            <div
                ref={DropDownBalanceRef}
                className="relative"
            >
                <button
                    onClick={() => setIsBalanceOpen(!isBalanceOpen)}
                    className="px-4 py-1 font-semibold rounded-lg border 
                        border-green-200 flex items-center gap-2
                        bg-gradient-to-r from-green-50 to-green-100
                        hover:bg-green-100 text-green-700 cursor-pointer
                        transition-all duration-200 ease-in"
                >
                    <DollarSign size={18} className="text-green-600"/> {isLoadingUserInfos ? (<span className="w-14 h-4 rounded-full flex bg-green-700/50 animate-pulse"/>) : userInfos?.totalbalance} Dh <ChevronDown size={16} className={`text-gray-400 ${isBalanceOpen && "rotate-180 transition-all duration-200 ease-in"}`} />
                </button>
                {isBalanceOpen && (
                    <div className="absolute overflow-hidden right-0 
                        mt-2 w-72 rounded-xl shadow-lg border 
                        bg-gradient-to-r from-white to-green-100
                        border-green-200 animate-fade-in">
                        <div
                            className="w-full
                                bg-green-100"
                        >
                            <div
                                className="w-full p-4 flex items-center justify-between"
                            >
                                <span className="flex flex-col gap-2">
                                    <h1 
                                        className="flex items-center gap-1 uppercase 
                                            font-semibold text-gray-500"
                                    >
                                        <span 
                                            className="w-2 h-2 bg-green-600 flex 
                                                rounded-full animate-pulse"
                                        />
                                        Total Balance
                                    </h1>
                                    <b className="text-3xl">500 Dh</b>
                                </span>
                                <span
                                    className="text-green-600 bg-white p-3 h-max 
                                        flex rounded-2xl shadow"
                                >
                                    <CreditCard size={30} />
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
                                        href={item.href}
                                        className="group flex items-center gap-2 
                                            hover:bg-green-100 hover:text-green-600 p-2 
                                            rounded-lg text-gray-600"
                                    >
                                        <span className={`bg-white shadow p-2 rounded-lg group-hover:text-green-600 ${item.iconstyles}`}><item.icon size={20} /></span> <h1>{item.label}</h1>
                                    </Link>
                                )
                            })}
                        </div>
                        <div
                            className="w-full flex justify-center p-4"
                        >
                            <button
                                className="py-1 bg-green-600 w-full rounded-lg addbalance-button cursor-pointer"
                            >
                                Add balance
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {/* Notifications */}
            <div ref={DropDownNotifsRef} className="relative">
                {/* Bell Icon with Badge */}
                <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="relative p-2 rounded-full hover:bg-blue-100 transition-colors"
                >
                    <Bell size={20} className="text-blue-600" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                    3
                    </span>
                </button>

                {/* Dropdown Menu */}
                {isNotificationsOpen && (
                    <div className="absolute overflow-hidden right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 animate-fade-in">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200">
                        <span className="text-sm font-semibold">{t("notifications.title")}</span>
                        <button className="text-xs text-blue-600 hover:underline">
                            {t("notifications.markAllAsRead")}
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
                        {t("notifications.viewAll")}
                    </div>
                    </div>
                )}
            </div>
            <span 
                className="border-r border-gray-200 h-6 flex"
            />
            {/* Profile Menu */}
            <div ref={DropDownProfileRef} className="relative">
                <button 
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 cursor-pointer">
                    <div
                        className='relative w-12 h-12'
                    >
                        <Image
                            src={userInfos?.profileimage as string || session?.user?.image as string || ""}
                            alt={session?.user?.name as string || ""}
                            fill
                            className="object-cover overflow-hidden rounded-full"
                        />
                        <span
                            className="absolute w-3 h-3 rounded-full bg-green-500 right-1 bottom-0 border-2 border-white"
                        />
                    </div>
                    <div
                        className="flex flex-col items-start"
                    >
                        <div
                            className="w-full flex items-center justify-between"
                        >
                            <span className="text-sm font-medium text-gray-900">
                                {isLoadingUserInfos ? (<span className="animate-pulse w-25 h-3 bg-gray-100 flex rounded"/>) : userInfos?.fullname}
                            </span>
                            <ChevronDown size={18} className="text-gray-500"/>
                        </div>
                        <span className="text-sm font-medium text-gray-500">
                            {session?.user?.email}
                        </span>
                    </div>
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                    <div
                        className="absolute right-0 top-full mt-2 w-full 
                            bg-white shadow-lg border border-gray-200 
                            rounded-xl overflow-hidden animate-fade-in"
                    >
                        {/* Profile Menu Items */}
                        <div className="flex flex-col p-2">
                            {ProfileHeaderNavs.map((nav, idx) => (
                                <Link
                                    key={idx}
                                    onClick={() => setIsProfileMenuOpen(false)}
                                    href={`/seller/${nav.href !== "dashboard" ? nav.href : ""}`}
                                    className={`flex items-center px-3 py-2 text-gray-500 
                                        rounded-xl hover:bg-blue-50 hover:text-blue-700 
                                        transition-colors gap-2`}
                                >
                                    {/* Optional Icon */}
                                    <span className="">
                                        <nav.icon size={16} />
                                    </span>
                                    <span className="capitalize">{nav.label}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200"></div>

                        {/* Sign Out Button */}
                        <button
                            onClick={() => signOut()}
                            className="w-full cursor-pointer flex 
                                items-center justify-center px-4 py-2 
                                text-red-600 font-medium hover:bg-red-50 
                                transition-colors"
                        >
                            {t("profiledropdown.signout")}
                        </button>
                    </div>
                    )}
            </div>
            </div>
        </section>
    )
}