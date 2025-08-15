"use client";

import { useState } from "react";




export function InputHero(){
    const [searchInput, setSearchInput] = useState("");
    return (
        <div
            className="bg-white w-full max-w-[700px] rounded-full 
                overflow-hidden p-0.5 flex items-center"
        >
            <input 
                type="text" 
                onChange={(e) => setSearchInput(e.target.value)}
                value={searchInput}
                id=""
                placeholder="What are you looking For ?"
                className="w-full py-3 px-6 outline-none border-none rounded"
            />
            <button
                className="px-6 text-lg cursor-pointer h-full 
                    rounded-full bg-black text-white"
            >
                search
            </button>
        </div>
    )
}