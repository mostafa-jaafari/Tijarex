"use client";

import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";



export function DropDownShoppingCart(){
    const [isOpen, setIsOpen] = useState(false);
    const MenuRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const handleHideMenu = (e: MouseEvent) => {
            if(MenuRef.current && !MenuRef.current.contains(e.target as Node)){
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleHideMenu);
        return () => document.removeEventListener("mousedown", handleHideMenu);
    },[])
    return (
        <section
            ref={MenuRef}
            className="relative"
        >
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="text-teal-700 hover:text-teal-600
                    p-1 cursor-pointer"
            >
                <ShoppingCart 
                    size={20}
                />
            </button>
            <div
                className={`absolute right-0 top-full p-2 flex flex-col 
                    gap-2 mt-3 min-w-84 bg-white border border-gray-200 
                    shadow-sm rounded-lg overflow-hidden
                    transition-all duration-200
                    ${isOpen
                        ? "opacity-100 max-h-100 overflow-y-scroll"
                        : "opacity-0 max-h-0 overflow-hidden pointer-events-none"
                    }`}
            >
                {Array(4).fill(0).map((_, idx) => {
                    return (
                        <div
                            key={idx}
                            className={`w-full flex-shrink-0 rounded-lg min-h-20 bg-gray-50 p-2 flex items-start gap-3
                                border-b border-gray-300 hover:shadow-sm`}
                        >
                            <div
                                className="relative flex-shrink-0 w-20 h-20 rounded-lg 
                                    bg-gray-50 border border-gray-200 overflow-hidden"
                            >
                                <Image
                                    src="/HeadPhone-Product.png"
                                    alt=""
                                    fill
                                    className="object-cover"
                                    loading="lazy"
                                    quality={100}
                                />
                            </div>
                            {/* --- Text Content --- */}
                            <div
                                className="py-1"
                            >
                                <h1
                                    className="text-sm text-gray-700"
                                >
                                    Lorem ipsum dolor, sit amet.
                                </h1>

                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}