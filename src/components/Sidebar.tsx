"use client";
import { 
    Home, 
    RotateCcw, 
    ShoppingBag, 
    ShoppingCart, 
    Settings, 
    HelpCircle, 
    ChevronLeft,
    ChevronRight,
    User,
    Store,
    UploadCloud,
    Heart,
    Layout
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { SwitchLanguage } from "./SwitchLanguage";
import { useUserInfos } from "@/context/UserInfosContext";
import { BlackButtonStyles } from "./Header";

export function Sidebar() {
    const { isLoadingUserInfos, userInfos } = useUserInfos();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const Navigation_Links = [
        {
            label: "dashboard",
            icon: Home,
            href: userInfos?.UserRole === "affiliate" ? "affiliate" : "seller",
            badge: null,
        },
        {
            label: "products",
            icon: ShoppingCart,
            href: "products",
            badge: "12",
        },
        {
            label: "orders",
            icon: ShoppingBag,
            href: "orders",
            badge: "3",
        },
        ...(userInfos?.UserRole === "affiliate" ? [{
            label: "my store",
            icon: Store,
            href: "my-store",
            badge: null,
        }] : []),
        {
            label: "returns",
            icon: RotateCcw,
            href: "returns",
            badge: null,
        },
        {
            label: "favorites",
            icon: Heart,
            href: "favorites",
            badge: null,
        },
        ...(userInfos?.UserRole !== "affiliate" ? [{
            label: "upload products",
            icon: UploadCloud,
            href: "upload-products",
            badge: null,
        }] : []),
    ];

    const Tools_Links = [
        {
            label: "manage_users",
            icon: User,
            href: "profile",
        },
        ...(userInfos?.UserRole === "affiliate" ? [{
            label: "Templates",
            icon: Layout,
            href: "store-templates",
        }] : []),
        {
            label: "settings",
            icon: Settings,
            href: "settings",
        },
        {
            label: "help",
            icon: HelpCircle,
            href: "help",
        },
    ];
// affiliatepageid
    const AffiliagePageId = useParams().affiliatepageid || "affiliate";
    const SellerPageId = useParams().sellerpageid || "seller";
    const params = userInfos?.UserRole === "affiliate" ? AffiliagePageId || "affiliate" : SellerPageId || "seller";
    return (
        <aside className={`group
            ${isCollapsed ? 'w-16' : 'w-74'} 
            h-screen pb-14 transition-all duration-300 
            flex flex-col sticky top-0 overflow-hidden
        `}>
            {/* Header */}
            <div 
                className={`flex items-center justify-between 
                    ${isCollapsed ? "p-2" : "py-2.5 px-4"} border-b border-gray-100`}>
                {!isCollapsed && (
                    <div 
                        className="flex items-center gap-3">
                        <div 
                            className={`w-8 h-8 rounded-lg flex items-center 
                                justify-center
                                ${BlackButtonStyles}`}
                        >
                            <span className="text-white font-bold text-sm">J</span>
                        </div>
                        <div>
                            <h1 className="font-semibold text-gray-900">
                                Tijarex
                            </h1>
                            <p className="text-xs text-gray-500">
                                Seller Portal
                            </p>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="group h-max flex justify-center p-1.5 rounded-lg 
                        text-gray-600"
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isCollapsed ? (
                        <div 
                            className={`relative 
                                w-8 h-8 rounded-lg 
                                flex items-center justify-center
                                ${BlackButtonStyles}`}
                        >
                            <span className="group-hover:opacity-0 
                                group-hover:pointer-events-none 
                                text-white font-bold text-sm">J</span>
                            <span
                                className="absolute flex inset-0 items-center 
                                    justify-center text-white cursor-pointer"
                            >
                                <ChevronRight 
                                    size={20} 
                                    className="opacity-0 pointer-events-none 
                                        group-hover:opacity-100 group-hover:pointer-events-auto 
                                        transition-opacity"
                                />
                            </span>
                        </div>
                    ) : (
                        <span
                            className="hover:bg-neutral-300 hover:text-neutral-500 
                                cursor-pointer p-2 rounded-lg"
                        >
                            <ChevronLeft size={16} />
                        </span>
                    )}
                </button>
            </div>

            {/* Navigation Content */}
            <div className="flex-1 py-4">
                {/* Primary Navigation */}
                <div className="px-3 mb-6">
                    {!isCollapsed && (
                        <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 px-3">
                            Navigation
                        </h2>
                    )}
                    <nav className={`${isCollapsed ? 'space-y-2' : 'space-y-1'}`}>
                        {Navigation_Links.map((nav, idx) => {
                            const isActive = params === nav.href;
                            return (
                                <Link
                                    href={`/${userInfos?.UserRole === "seller" ? "seller" : "affiliate"}/${nav.href !== "seller" && nav.href !== "affiliate" ? nav.href : ""}`}
                                    key={idx}
                                    className={`
                                        group flex items-center capitalize px-3 py-2 text-sm 
                                            font-medium rounded-lg transition-colors
                                        ${isActive
                                            ? `bg-neutral-50 shadow shadow-neutral-600/20 text-neutral-700 font-semibold border-neutral-600 border-l-3` 
                                            : "text-gray-700 hover:bg-gray-100"
                                        }
                                        ${isCollapsed ? 'justify-center' : 'justify-start'}
                                    `}
                                    title={isCollapsed ? nav.label : undefined}
                                >
                                    <nav.icon 
                                        size={18} 
                                        className={`flex-shrink-0 ${isCollapsed ? '' : 'mr-3'} ${isActive ? 'text-neutral-800' : 'text-gray-500'}`} 
                                    />
                                    {!isCollapsed && (
                                        <div className="flex-1 flex items-center justify-between">
                                            <span>{nav.label}</span>
                                            {nav.badge && (
                                                <span className="bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-full font-medium">
                                                    {nav.badge}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Tools Section */}
                <div className="px-3">
                    {!isCollapsed && (
                        <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 px-3">
                            Tools
                        </h2>
                    )}
                    <nav className={`${isCollapsed ? 'space-y-2' : 'space-y-1'}`}>
                        {Tools_Links.map((tool, idx) => {
                            const isActive = params === tool.href;
                            return (
                                <Link
                                    href={`/${userInfos?.UserRole === "seller" ? "seller" : "affiliate"}/${tool.href !== "seller" ? tool.href : ""}`}
                                    key={idx}
                                    className={`
                                        group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                                        ${isActive 
                                            ? `bg-neutral-50 shadow shadow-neutral-600/20 text-neutral-700 font-semibold border-neutral-600 border-l-3` 
                                            : "text-gray-700 hover:bg-gray-100"
                                        }
                                        ${isCollapsed ? 'justify-center' : 'justify-start'}
                                    `}
                                    title={isCollapsed ? tool.label : undefined}
                                >
                                    <tool.icon 
                                        size={18} 
                                        className={`flex-shrink-0 ${isCollapsed ? '' : 'mr-3'} ${isActive ? 'text-neutral-800' : 'text-gray-500'}`} 
                                    />
                                    {!isCollapsed && (
                                        <span>{tool.label}</span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* User Profile & Sign Out */}
            <div className="border-t border-gray-100 p-4">
                {!isCollapsed && (
                    <div className="flex space-y-2 flex-col items-center">
                        <div
                            className="w-full"
                        >
                            <SwitchLanguage
                                CLASSNAME="text-sm w-full flex items-center 
                                    justify-between bg-neutral-100 px-2 py-1 
                                    rounded-full border border-neutral-300 
                                    text-neutral-600 cursor-pointer"
                            />
                        </div>
                        <div
                            className="flex items-center gap-2 bg-gray-50 space-x-3 mb-3 p-2 rounded-lg"
                        >
                            <div className="relative flex-shrink-0 w-8 h-8 bg-gray-300 overflow-hidden rounded-full flex items-center justify-center">
                                {userInfos?.profileimage ? (
                                    <Image
                                        src={userInfos?.profileimage}
                                        alt={userInfos?.fullname}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-600 font-medium text-sm">{userInfos?.fullname.slice(0 ,2).toUpperCase()}</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <span className="text-sm font-medium text-gray-900">
                                {isLoadingUserInfos ? (<span className="animate-pulse w-25 h-3 bg-gray-100 flex rounded"/>) : userInfos?.fullname}
                            </span>
                                <p className="text-xs text-gray-500">
                                    {userInfos?.email}
                                </p>

                            </div>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}