"use client";

import Link from "next/link";
import { useState } from "react";




export function InputHero(){
    const [searchInput, setSearchInput] = useState("");
    const SearchSuggestions = [
        "Moroccan handmade crafts",
        "Traditional clothing",
        "Unique accessories",
        "Natural beauty products",
        "Electronics & smart devices",
        "Gifts & art collectibles"
    ];
    return (
        <section
            className="relative w-full max-w-[700px]"
        >
            <div
                className="w-full bg-white h-14 rounded-full 
                    overflow-hidden p-0.5 flex items-center"
            >
                <input 
                    type="text" 
                    onChange={(e) => setSearchInput(e.target.value)}
                    value={searchInput}
                    id=""
                    placeholder="What are you looking For ?"
                    className="w-full h-full px-6 outline-none border-none rounded"
                />
                <button
                    className="px-6 text-lg cursor-pointer h-full
                        rounded-full bg-black text-white"
                >
                    search
                </button>
            </div>
            <div
                className="absolute left-0 top-full w-full mt-1"
            >
                <div
                    className="w-full bg-white rounded-xl border 
                        border-gray-200 flex flex-col "
                >
                    {SearchSuggestions.map((item, idx) => {
                        return (
                            <Link
                                key={idx}
                                href="/"
                                className="w-full flex bg-red-500"
                            >
                                {item}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}