"use client";

import { ProductType } from "@/types/product";
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

    const [searchResult, setSearchResult] = useState<ProductType[] | []>([]);
    const [isLoadingSearch, setIsLoadingSearch] = useState(false);
    useEffect(() => {
        if(searchInput === ""){
            setSearchResult([]);
            setIsLoadingSearch(false);
            return;
        }
        const controller = new AbortController();
        const handleFetchSearch = async () => {
            setIsLoadingSearch(true);
            try {
                const Res = await fetch("/api/products");
                const { products } = await Res.json();
                if(Array.isArray(products)){
                    const FiltredSearch = products.filter((product: ProductType) => 
                        product.category.includes(searchInput.toLowerCase()) || 
                        product.owner?.name.toLowerCase().includes(searchInput.toLowerCase()) ||
                        product.title.toLowerCase().includes(searchInput.toLowerCase())
                );
                    setSearchResult(FiltredSearch as ProductType[]);
                }else{
                    setSearchResult([]);
                }
            }catch (err){
                console.log(err)
            }finally{
                setIsLoadingSearch(false);
            }
        }
        const timeoutId = setTimeout(() => handleFetchSearch(), 300);
        return () => {
            clearTimeout(timeoutId);
            controller.abort();
        };
    },[searchInput])

    function highlightMatch(text: string, query: string) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.split(regex).map((part, idx) =>
            regex.test(part) ? (
            <span key={idx} className="text-yellow-500">{part}</span>
            ) : (
            part
            )
        );
    }


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
                    className="w-full max-h-64 bg-white rounded-xl border 
                        p-3 border-gray-200 flex flex-col 
                        overflow-auto shadow-md"
                >
                    {isLoadingSearch ? 
                    (
                        <div
                            className="flex flex-col gap-2"
                        >
                            <span className="w-4/4 h-5 animate-pulse flex bg-gray-200 rounded-full"/>
                            <span className="w-3/4 h-5 animate-pulse flex bg-gray-200 rounded-full"/>
                            <span className="w-2/4 h-5 animate-pulse flex bg-gray-200 rounded-full"/>
                            <span className="w-4/4 h-5 animate-pulse flex bg-gray-200 rounded-full"/>
                            <span className="w-3/4 h-5 animate-pulse flex bg-gray-200 rounded-full"/>
                            <span className="w-2/4 h-5 animate-pulse flex bg-gray-200 rounded-full"/>
                        </div>
                    )
                    :
                    searchResult.length !== 0 ?
                    searchResult.map((item, idx) => (
                        <Link
                            key={idx}
                            href="/"
                            className="w-full flex items-center gap-2 py-2 
                                px-3 text-sm hover:bg-gray-50 rounded-xl"
                        >
                            <PackageSearch size={16} className="text-gray-500" />{" "}
                            {highlightMatch(item.title, searchInput)}
                        </Link>
                    ))
                    :
                    !isLoadingSearch && searchResult.length === 0 && searchInput !== "" ?
                    (
                        <div
                            className="w-full flex justify-center py-3 text-gray-400"
                        >
                            Not Founded !
                        </div>
                    )
                    :
                    searchInput === "" && SearchSuggestions.map((item, idx) => (
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