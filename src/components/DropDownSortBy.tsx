"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";




export const DropDownSortBy = () => {
    const Sorts_Labels = ["Newest", "Low to High", "High to Low"];
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState("");
    const MenuRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const hideMenuRef = (e:MouseEvent) => {
            if(MenuRef.current && !MenuRef.current.contains(e.target as Node)){
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", hideMenuRef);
        return () => document.removeEventListener("mousedown", hideMenuRef);
    },[])
    return (
        <section
            ref={MenuRef}
            className="relative w-full my-2"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-2 rounded-lg font-semibold 
                    bg-white py-1 flex items-center justify-between
                    px-3 ring cursor-pointer ring-gray-300 shadow-sm
                    hover:bg-gray-100"
            >
                {selectedSort !== "" ? selectedSort : "Popularity"} <ChevronDown size={14} />
            </button>
            <div
                className={`absolute top-full left-0 bg-white
                    flex flex-col items-start w-full mt-1
                    rounded-lg ring ring-gray-300 shadow-sm
                    overflow-hidden origin-top 
                    transition-all duration-300 ease-in-out
                    ${isOpen ? "max-h-64 overflow-hidden opacity-100"
                    : "max-h-0 overflow-hidden pointer-events-none opacity-0"}`}
            >
                {Sorts_Labels.map((sort, idx) => {
                    return (
                        <button
                            key={idx}
                            disabled={selectedSort.toLowerCase() === sort.toLowerCase()}
                            onClick={() => {
                                setSelectedSort(sort);
                                setIsOpen(false);
                            }}
                            className={`w-full text-start py-2 px-3
                                ${selectedSort.toLowerCase() === sort.toLowerCase() ?
                                    "font-semibold tex-black bg-gray-100"
                                    :
                                    "hover:bg-gray-100 hover:text-black text-gray-600 cursor-pointer"
                                }`}
                        >
                            {sort}
                        </button>
                    )
                })}
            </div>
        </section>
    )
}