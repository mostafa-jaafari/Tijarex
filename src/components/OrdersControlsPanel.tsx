"use client";

import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface Props {
    searchQuery: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchClear: () => void;
    activeFilterCount: number;
    onFilterToggle: () => void;
}

export const OrdersControlsPanel = ({ 
    searchQuery, 
    onSearchChange, 
    onSearchClear, 
    activeFilterCount, 
    onFilterToggle 
}: Props) => {
    return (
        <div className="p-6 rounded-lg border border-neutral-800 bg-gradient-to-r from-[#1A1A1A] via-neutral-800 to-[#1A1A1A]">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-white">Your Orders</h1>
                <p className="mt-2 text-gray-400">Review and manage all your past and current orders.</p>
            </header>
            <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
                <div className="w-full md:w-2/5 lg:w-1/3 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by Order ID, Product, Seller..."
                        value={searchQuery}
                        onChange={onSearchChange}
                        className="w-full pl-12 pr-10 py-2.5 border border-neutral-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 text-gray-200 bg-neutral-800 placeholder:text-gray-400"
                    />
                    {searchQuery && (
                        <button onClick={onSearchClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-100 p-1">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={onFilterToggle} 
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg border border-neutral-700 text-gray-100 bg-neutral-800 hover:bg-neutral-700 transition-colors"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>Filters</span>
                        {activeFilterCount > 0 && (
                            <span className="ml-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-teal-700 text-white text-xs font-bold rounded-full">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}