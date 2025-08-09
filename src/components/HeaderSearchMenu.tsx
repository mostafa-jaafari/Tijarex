"use client";
import { Search } from 'lucide-react';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

interface HeaderInputSearchProps{
    inputSearch: string;
    setInputSearch: (e: string) => void;
    isSearchOpen: boolean;
    setIsSearchOpen: (isOpen: boolean) => void;
}

const HeaderInputSearchContext = createContext<HeaderInputSearchProps | null>(null);

export function HeaderInputSearchContextProvider({ children }: {children: React.ReactNode;}){
    const [inputSearch, setInputSearch] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    return (
        <HeaderInputSearchContext value={{ inputSearch, setInputSearch, isSearchOpen, setIsSearchOpen }}>
            {children}
        </HeaderInputSearchContext>
    )
}
export const useHeaderSearchInput = () => {
    const Context = useContext(HeaderInputSearchContext);
    if(!Context){
        throw new Error("HeaderInputSearchContext must be used within useHeaderSearchInput")
    }
    return Context;
}

export function HeaderInputSearch(){
    const { inputSearch, setInputSearch, setIsSearchOpen, isSearchOpen } = useHeaderSearchInput();
    return (
        <div
            className="w-full lg:max-w-1/2 max-w-[400px] border 
                border-gray-200 rounded-full flex items-center 
                p-1 overflow-hidden focus-within:ring-2 
                focus-within:ring-teal-500 transition-colors"
        >
          <input 
            type="text"
            value={inputSearch}
            onFocus={() => setIsSearchOpen(isSearchOpen === false && true)}
            onChange={(e) => {
                setInputSearch(e.target.value)
            }}
            placeholder="Search for everything"
            className="grow py-2 px-4 border-none outline-none
              focus:text-teal-600"
        />
            <span
                className="group p-2.5 rounded-full cursor-pointer
                    primary-button text-white"
            >
                <Search 
                    size={20} 
                    className="group-hover:rotate-45 group-hover:scale-105 
                        transition-all duration-300"
                />
            </span>
        </div>
    )
}

export function HeaderSearchMenu() {
    const { inputSearch, isSearchOpen, setIsSearchOpen } = useHeaderSearchInput();
    const SearchMenuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleHideSearchMenu = (e: MouseEvent) => {
            if(SearchMenuRef.current && !SearchMenuRef.current.contains(e.target as Node)){
                setIsSearchOpen(false);
            }
        }
        document.addEventListener("mousedown", handleHideSearchMenu);
        return () => document.removeEventListener("mousedown", handleHideSearchMenu);
    },[setIsSearchOpen])
    if(isSearchOpen){
        return (
            <div
                className="absolute left-0 top-full w-full h-screen 
                    bg-neutral-900/30 flex justify-center"
                    >
                <div
                    ref={SearchMenuRef}
                    className="w-full md:w-1/2 lg:w-1/2 bg-teal-50 
                        mt-1 rounded-xl p-6"
                >
                {inputSearch}
                </div>
            </div>
        )
    }
}
