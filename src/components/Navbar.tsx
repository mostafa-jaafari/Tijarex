"use client";

import { 
    Home, 
    RotateCcw, 
    ShoppingBag, 
    ShoppingCart, 
    LogOut, 
    Settings, 
    HelpCircle, 
    Users,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export function Navbar() {
    const [isCollapsed, setIsCollapsed] = useState(true);
    
    const Navigation_Links = [
        {
            label: "Dashboard",
            icon: Home,
            href: "seller",
            badge: null,
        },
        {
            label: "Products",
            icon: ShoppingCart,
            href: "products",
            badge: "12",
        },
        {
            label: "Orders",
            icon: ShoppingBag,
            href: "orders",
            badge: "3",
        },
        {
            label: "Returns",
            icon: RotateCcw,
            href: "returns",
            badge: null,
        },
    ];

    const Tools_Links = [
        {
            label: "Settings",
            icon: Settings,
            href: "settings",
        },
        {
            label: "Help & Support",
            icon: HelpCircle,
            href: "help",
        },
        {
            label: "Manage Users",
            icon: Users,
            href: "manage-user",
        },
    ];

    const params = useParams().sellerpageid || "seller";

    return (
        <aside className={`
            ${isCollapsed ? 'w-16' : 'w-74'} 
            bg-white border-r border-gray-200 h-screen transition-all duration-300 
            flex flex-col sticky top-0 overflow-hidden
        `}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                {!isCollapsed && (
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">X</span>
                        </div>
                        <div>
                            <h1 className="font-semibold text-gray-900">Xenith</h1>
                            <p className="text-xs text-gray-500">Seller Portal</p>
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
                            Navigation
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
                                            ? "bg-blue-50 text-blue-700 border-l-2 border-blue-600" 
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
                            Tools
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
                                            ? "bg-blue-50 text-blue-700 border-l-2 border-blue-600" 
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
                    <div className="flex items-center space-x-3 mb-3 p-2 rounded-lg bg-gray-50">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium text-sm">JD</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">John Doe</p>
                            <p className="text-xs text-gray-500">john@store.com</p>
                        </div>
                    </div>
                )}
                
                <button
                    onClick={() => signOut()}
                    className={`
                        w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors
                        ${isCollapsed ? 'justify-center' : 'justify-start'}
                    `}
                    title={isCollapsed ? "Sign Out" : undefined}
                >
                    <LogOut 
                        size={18} 
                        className={`${isCollapsed ? '' : 'mr-3'}`} 
                    />
                    {!isCollapsed && <span>Sign Out</span>}
                </button>
            </div>
        </aside>
    );
}