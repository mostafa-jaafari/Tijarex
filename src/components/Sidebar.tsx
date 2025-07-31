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
    User
} from "lucide-react";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl"
import { SwitchLanguage } from "./SwitchLanguage";
import { useUserInfos } from "@/context/UserInfosContext";

export function Sidebar({ session }: { session: Session | null }) {
    const t = useTranslations("sidebar");
    const locale = useLocale();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const Navigation_Links = [
        {
            label: t("dashboard"),
            icon: Home,
            href: "seller",
            badge: null,
        },
        {
            label: t("products"),
            icon: ShoppingCart,
            href: "products",
            badge: "12",
        },
        {
            label: t("orders"),
            icon: ShoppingBag,
            href: "orders",
            badge: "3",
        },
        {
            label: t("returns"),
            icon: RotateCcw,
            href: "returns",
            badge: null,
        },
    ];

    const Tools_Links = [
        {
            label: t("manage_users"),
            icon: User,
            href: "profile",
        },
        {
            label: t("settings"),
            icon: Settings,
            href: "settings",
        },
        {
            label: t("help"),
            icon: HelpCircle,
            href: "help",
        },
    ];

    const params = useParams().sellerpageid || "seller";

    const { isLoadingUserInfos, userInfos } = useUserInfos();
    if(!session) return;
    return (
        <aside className={`
            ${isCollapsed ? 'w-16' : 'w-74'} 
            bg-white border-r border-gray-200 h-screen transition-all duration-300 
            flex flex-col sticky top-0 overflow-hidden
        `}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                {!isCollapsed && (
                    <div 
                        className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">J</span>
                        </div>
                        <div>
                            <h1 className="font-semibold text-gray-900">{t("brand")}</h1>
                            <p className="text-xs text-gray-500">{t("portal")}</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isCollapsed ? (
                        <ChevronRight size={16} />
                    ) : (
                        <ChevronLeft size={16} />
                    )}
                </button>
            </div>

            {/* Navigation Content */}
            <div className="flex-1 py-4">
                {/* Primary Navigation */}
                <div className="px-3 mb-6">
                    {!isCollapsed && (
                        <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 px-3">
                            {t("navigation")}
                        </h2>
                    )}
                    <nav className="space-y-1">
                        {Navigation_Links.map((nav, idx) => {
                            const isActive = params === nav.href;
                            return (
                                <Link
                                    href={`/seller/${nav.href !== "seller" ? nav.href : ""}`}
                                    key={idx}
                                    className={`
                                        group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                                        ${isActive 
                                            ? `bg-blue-50 text-blue-700 border-blue-600 border-l-2` 
                                            : "text-gray-700 hover:bg-gray-50"
                                        }
                                        ${isCollapsed ? 'justify-center' : 'justify-start'}
                                    `}
                                    title={isCollapsed ? nav.label : undefined}
                                >
                                    <nav.icon 
                                        size={18} 
                                        className={`flex-shrink-0 ${isCollapsed ? '' : 'mr-3'} ${isActive ? 'text-blue-600' : 'text-gray-500'}`} 
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
                            {t("tools")}
                        </h2>
                    )}
                    <nav className="space-y-1">
                        {Tools_Links.map((tool, idx) => {
                            const isActive = params === tool.href;
                            return (
                                <Link
                                    href={`/seller/${tool.href !== "seller" ? tool.href : ""}`}
                                    key={idx}
                                    className={`
                                        group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                                        ${isActive 
                                            ? `bg-blue-50 text-blue-700 border-blue-600 border-l-2` 
                                            : "text-gray-700 hover:bg-gray-50"
                                        }
                                        ${isCollapsed ? 'justify-center' : 'justify-start'}
                                    `}
                                    title={isCollapsed ? tool.label : undefined}
                                >
                                    <tool.icon 
                                        size={18} 
                                        className={`flex-shrink-0 ${isCollapsed ? '' : 'mr-3'} ${isActive ? 'text-blue-600' : 'text-gray-500'}`} 
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
                                CLASSNAME="w-full flex items-center justify-between 
                                    bg-blue-100 px-2 py-1 rounded-full border 
                                    border-blue-300 text-blue-600"
                            />
                        </div>
                        <div
                            className="flex items-center gap-2 bg-gray-50 space-x-3 mb-3 p-2 rounded-lg"
                        >
                            <div className="relative flex-shrink-0 w-8 h-8 bg-gray-300 overflow-hidden rounded-full flex items-center justify-center">
                                {session?.user?.image ? (
                                    <Image
                                        src={session?.user?.image}
                                        alt={session?.user?.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-600 font-medium text-sm">{session?.user?.name.slice(0 ,2).toUpperCase()}</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <span className="text-sm font-medium text-gray-900">
                                {isLoadingUserInfos ? (<span className="animate-pulse w-25 h-3 bg-gray-100 flex rounded"/>) : userInfos?.fullname}
                            </span>
                                <p className="text-xs text-gray-500">
                                    {session?.user?.email}
                                </p>

                            </div>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}