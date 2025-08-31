"use client";
import React from 'react';
import { Search, SlidersHorizontal, Grid3X3, List, X } from 'lucide-react';

interface ControlsPanelProps {
    searchQuery: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchClear: () => void;
    activeFilterCount: number;
    onFilterToggle: () => void;
    viewMode: 'grid' | 'table';
    showFilters: boolean; // Prop to determine if the filter panel is visible
    onViewModeChange: (mode: 'grid' | 'table') => void;
}

export const ControlsPanel = ({
    searchQuery,
    onSearchChange,
    onSearchClear,
    activeFilterCount,
    onFilterToggle,
    viewMode,
    onViewModeChange,
    showFilters
}: ControlsPanelProps) => {
    return (
        <div className="w-full">
            {/* 
              The header from your original code can be placed here if needed, 
              outside the main controls flex container for better layout.
            */}
            <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
                {/* Search Bar */}
                <div className="w-full relative">
                    <Search 
                        className="absolute left-2 top-1/2 -translate-y-1/2 
                            text-gray-400 w-4 h-4 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search products, brands..."
                        value={searchQuery}
                        onChange={onSearchChange}
                        className="max-w-[300px] w-full bg-neutral-50 pl-8 py-2 text-sm
                            rounded-lg ring ring-neutral-300 border-b border-neutral-500
                            focus:outline-none focus:bg-white"
                    />
                    {searchQuery && (
                        <button 
                            onClick={onSearchClear} 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black p-1 rounded-full transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Right-side Controls */}
                <div className="flex items-center gap-2">
                    {/* Filters Button */}
                    <button
                        onClick={onFilterToggle}
                        className={`flex items-center gap-2 py-1.5 px-4 cursor-pointer 
                            rounded-lg ring ring-neutral-300 border-b 
                            text-neutral-700 border-neutral-500 text-sm
                            ${showFilters 
                                ? "bg-white hover:bg-neutral-50 border-gray-300" 
                                : "bg-neutral-50 hover:bg-white border-gray-300"
                        }`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>Filters</span>
                        {activeFilterCount > 0 && (
                            <span 
                                className="ml-1 flex items-center justify-center 
                                    min-w-[20px] h-5 px-1.5 rounded-full
                                    border border-purple-400 text-purple-600 text-xs font-semibold">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    {/* View Mode Switcher */}
                    <div className="flex items-center">
                        <button 
                            onClick={() => onViewModeChange('table')} 
                            className={`p-1.5 rounded-lg transition-colors ${
                                viewMode === 'table' 
                                    ? 'bg-black text-neutral-200 cursor-normal' 
                                    : 'text-gray-500 hover:text-black cursor-pointer'
                            }`}
                            aria-label="List view"
                        >
                            <List size={20} />
                        </button>
                        <button 
                            onClick={() => onViewModeChange('grid')}
                            className={`p-1.5 rounded-lg
                                ${viewMode === 'grid' 
                                    ? 'bg-black text-neutral-200 cursor-normal' 
                                    : 'text-gray-500 hover:text-black cursor-pointer'
                            }`}
                            aria-label="Grid view"
                        >
                            <Grid3X3 size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};