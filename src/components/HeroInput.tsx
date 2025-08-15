"use client";

import { PackageSearch } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function InputHero() {
    const [searchInput, setSearchInput] = useState("");
    const SearchSuggestions = [
        { label: "Moroccan handmade crafts", icon: PackageSearch },
        { label: "Traditional clothing", icon: PackageSearch },
        { label: "Unique accessories", icon: PackageSearch },
        { label: "Natural beauty products", icon: PackageSearch },
        { label: "Electronics & smart devices", icon: PackageSearch },
        { label: "Gifts & art collectibles", icon: PackageSearch },
    ];

    const [showSuggestionsMenu, setShowSuggestionsMenu] = useState(false);
    const MenuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleHideMenu = (e: MouseEvent) => {
            if (MenuRef.current && !MenuRef.current.contains(e.target as Node)) {
                setShowSuggestionsMenu(false);
            }
        };
        document.addEventListener("mousedown", handleHideMenu);
        return () => document.removeEventListener("mousedown", handleHideMenu);
    }, []);

    return (
        <section ref={MenuRef} className="relative w-full max-w-[700px]">
            <div className="w-full bg-white h-14 rounded-full overflow-hidden p-0.5 flex items-center">
                <input
                    type="text"
                    onFocus={() => setShowSuggestionsMenu(true)}
                    onChange={(e) => setSearchInput(e.target.value)}
                    value={searchInput}
                    placeholder="What are you looking for?"
                    className="w-full h-full px-6 outline-none border-none rounded"
                />
                <button className="px-6 text-lg cursor-pointer h-full rounded-full bg-black text-white">
                    search
                </button>
            </div>

            {/* Animated menu */}
            <div
                className={`absolute left-0 top-full w-full mt-1 origin-top transition-all duration-300 ease-out ${
                    showSuggestionsMenu
                        ? "opacity-100 max-h-64 overflow-hidden opacity-100"
                        : "opacity-0 max-h-0 overflow-hidden pointer-events-none"
                }`}
            >
                <div 
                    className="w-full bg-white rounded-xl border 
                        p-3 border-gray-200 flex flex-col 
                        overflow-hidden shadow-md"
                >
                    {SearchSuggestions.map((item, idx) => (
                        <Link
                            key={idx}
                            href="/"
                            className="w-full flex items-center gap-2 py-2 px-3 text-sm hover:bg-gray-50 rounded-xl"
                        >
                            <item.icon size={16} className="text-gray-500" />{" "}
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}