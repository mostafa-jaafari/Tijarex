"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useUserInfos } from "@/context/UserInfosContext";
import { PrimaryDark } from "@/app/[locale]/page";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  Home, ShoppingCart, ShoppingBag, FolderOpen, 
  RotateCcw, Heart, UploadCloud, User, Layout, 
  Settings, HelpCircle 
} from "lucide-react";
import { useAffiliateAvailableProducts } from "@/context/AffiliateAvailableProductsContext";
interface SideBarClientProps {
    UserRole: string;
}
export function SidebarClient({ UserRole }: SideBarClientProps) {
    const { isLoadingUserInfos, userInfos } = useUserInfos();
    const { affiliateAvailableProductsData } = useAffiliateAvailableProducts();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const Navigation_Links = [
        {
            label: "dashboard",
            icon: Home,
            href: UserRole === "affiliate" ? "affiliate" : "seller",
            badge: null,
        },
        {
            label: "products",
            icon: ShoppingCart,
            href: "products",
            badge: affiliateAvailableProductsData?.length,
        },
        {
            label: "orders",
            icon: ShoppingBag,
            href: "orders",
            badge: null,
        },
        ...(UserRole === "affiliate" ? [{
            label: "my collection",
            icon: FolderOpen,
            href: "my-collection",
            badge: userInfos?.AffiliateProductsIDs.length,
        }] : []),
        ...(UserRole === "seller" ? [{
            label: "my products",
            icon: FolderOpen,
            href: "my-products",
            badge: null,
            // userInfos?.AffiliateProductsIDs.length,
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
            badge: userInfos?.favoriteProductIds?.length,
        },
        ...(UserRole !== "affiliate" ? [{
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
        ...(UserRole === "affiliate" ? [{
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

    const SubPagesId = useParams().subpagesid;
    const params = SubPagesId ? `${SubPagesId}` : `${userInfos?.UserRole === "seller" ? "seller" : userInfos?.UserRole === "affiliate" ? "affiliate" : ""}`;
    return (
        <aside className={`group bg-white z-30 border-r border-gray-200
            ${isCollapsed ? 'w-16' : 'w-60 flex-shrink-0'} 
            h-screen pb-14 transition-all duration-300 
            flex flex-col sticky top-0 overflow-auto
        `}>
            {/* Header */}
            <div 
                className={`flex items-center justify-between 
                    ${isCollapsed ? "p-2" : "py-2.5 px-4"}`}>
                {!isCollapsed && (
                    <div 
                        className="flex items-center gap-3">
                        <div 
                            className={`w-8 h-8 rounded-lg flex items-center 
                                justify-center ${PrimaryDark}
                                ring ring-neutral-200 shadow`}
                        >
                            <span className="text-white font-bold text-sm">J</span>
                        </div>
                        <div>
                            <h1 className="font-semibold text-gray-900">
                                Shopex
                            </h1>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                {isLoadingUserInfos ? <span className="flex w-11 h-2.5 rounded bg-neutral-200 animate-pulse"/> : userInfos && userInfos?.UserRole.charAt(0).toUpperCase() + userInfos?.UserRole.slice(1)} Portal
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
                                flex items-center justify-center ${PrimaryDark}
                                ring ring-neutral-200 shadow`}
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
                            <ChevronLeft
                                size={16}
                            />
                        </span>
                    )}
                </button>
            </div>

            {/* Navigation Content */}
            <div className="flex-1 py-2">
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
                                    href={`/admin/${userInfos?.UserRole === "seller" ? "seller" : "affiliate"}/${nav.href !== "seller" && nav.href !== "affiliate" ? nav.href : ""}`}
                                    key={idx}
                                    prefetch
                                    className={`relative
                                        group text-sm flex items-center capitalize px-3 py-2 
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
                                        className={`flex-shrink-0 
                                            ${isCollapsed ? '' : 'mr-3'} 
                                            ${isActive ? 
                                                'text-neutral-800'
                                                :
                                                'text-gray-500'}
                                        `} 
                                    />
                                    {nav.badge && nav.badge > 0 ? (isCollapsed && nav.badge && isActive) && (
                                        <span 
                                            className="absolute -right-2 -top-2 flex 
                                                bg-red-100 text-red-600 
                                                text-xs py-0 px-1 h-max rounded-full font-medium
                                                ring ring-red-200"
                                        >
                                            {nav.badge}
                                        </span>
                                    ) : null}
                                    {!isCollapsed && (
                                        <div className="flex-1 flex items-center justify-between">
                                            <span>{nav.label}</span>
                                            {(nav.badge && nav.badge > 0) ? (
                                                <span className="bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-full font-medium">
                                                    {nav.badge}
                                                </span>
                                            ) : null}
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
                                    prefetch
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
                                        className={`flex-shrink-0 
                                            ${isCollapsed ? '' : 'mr-3'} 
                                            ${isActive ? 
                                                'text-neutral-800'
                                                :
                                                'text-gray-500'}
                                        `} 
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

            {/* User Profile & Sign Out
            <div className="px-4">
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
                    </div>
                )}
            </div> */}
        </aside>
    );
}