import React from 'react';
import { Search, SlidersHorizontal, Grid3X3, List, X } from 'lucide-react';

interface ControlsPanelProps {
    searchQuery: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchClear: () => void;
    activeFilterCount: number;
    onFilterToggle: () => void;
    viewMode: 'grid' | 'table';
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
}: ControlsPanelProps) => {
    return (
        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="w-full md:w-2/5 lg:w-1/3 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search products, brands..."
                        value={searchQuery}
                        onChange={onSearchChange}
                        className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-colors"
                    />
                    {searchQuery && (
                        <button 
                            onClick={onSearchClear} 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 p-1"
                            aria-label="Clear search"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Right-side Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={onFilterToggle}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>Filters</span>
                        {activeFilterCount > 0 && (
                            <span className="ml-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button 
                            onClick={() => onViewModeChange('grid')} 
                            className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow' : 'text-gray-500 hover:bg-gray-200'}`}
                            aria-label="Grid view"
                        >
                            <Grid3X3 size={20} />
                        </button>
                        <button 
                            onClick={() => onViewModeChange('table')} 
                            className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-white text-blue-600 shadow' : 'text-gray-500 hover:bg-gray-200'}`}
                            aria-label="List view"
                        >
                            <List size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};