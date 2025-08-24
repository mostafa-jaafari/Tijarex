import React from 'react';
import { Search, SlidersHorizontal, Grid3X3, List, X } from 'lucide-react';


interface HeaderProps {
    title: string;
    description: string;
}
const Header = ({ title, description }: HeaderProps) => {
    return (
        <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
            <p className="mt-2 text-gray-400">{description}</p>
        </header>
    );
};
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
        <div 
            className="p-6 rounded-lg border border-gray-200
                bg-gradient-to-r from-[#1A1A1A] via-neutral-800 to-[#1A1A1A]">
            <div className="">
                <Header 
                    title="Affiliate Products" 
                    description="Discover and promote products to earn commissions." 
                />
                <div
                    className='flex flex-col md:flex-row items-center justify-between gap-4'
                >
                    {/* Search Bar */}
                    <div className="w-full md:w-2/5 lg:w-1/3 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search products, brands..."
                            value={searchQuery}
                            onChange={onSearchChange}
                            className="w-full pl-12 pr-10 py-2
                                border border-neutral-700
                                rounded-lg
                                focus:outline-none 
                                focus:ring-1
                                focus:ring-teal-200
                                text-gray-200
                                bg-neutral-800
                                placeholder:text-gray-400
                                hover:bg-neutral-900 
                            cursor-pointer transition-all"
                        />
                        {searchQuery && (
                            <button 
                                onClick={onSearchClear} 
                                className="absolute right-3 top-1/2 
                                    -translate-y-1/2 text-gray-500 
                                    hover:text-gray-100 p-1 cursor-pointer"
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
                        className="flex items-center gap-2 px-4 py-2.5 
                            text-sm font-semibold rounded-lg 
                            border border-neutral-700 
                            text-gray-100 bg-neutral-800 
                            hover:bg-neutral-900 
                            cursor-pointer transition-all"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>Filters</span>
                        {activeFilterCount > 0 && (
                            <span 
                                className="ml-1 flex items-center justify-center 
                                    min-w-[20px] h-5 px-1.5 bg-teal-700 text-white 
                                    text-xs font-bold rounded-full">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    <div 
                        className="flex items-center gap-1 bg-neutral-800 
                            border border-neutral-700 rounded-lg p-0.5">
                        <button 
                            onClick={() => onViewModeChange('grid')}
                            className={`p-1.5 rounded-md transition-colors 
                                ${viewMode === 'grid' ?
                                    'bg-neutral-900 border border-neutral-700 text-gray-100'
                                    :
                                    'text-gray-500 hover:bg-neutral-900 cursor-pointer'}`}
                            aria-label="Grid view"
                        >
                            <Grid3X3 size={20} />
                        </button>
                        <button 
                            onClick={() => onViewModeChange('table')} 
                            className={`p-1.5 rounded-md transition-colors 
                                ${viewMode === 'table' ?
                                    'bg-neutral-900 border border-neutral-700 text-gray-100'
                                    :
                                    'text-gray-500 hover:bg-neutral-900 cursor-pointer'}`}
                            aria-label="List view"
                        >
                            <List size={20} />
                        </button>
                    </div>
                </div>

                </div>

            </div>
        </div>
    );
};