// /components/products/ResultsBar.tsx (All-in-one component)

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- Dropdown data is defined directly in the component ---
const sortOptions = [
    { label: "Most Relevant", value: "relevance" },
    { label: "Best Selling", value: "sales_desc" },
    { label: "Highest Commission", value: "commission_desc" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Newest Arrivals", value: "date_desc" },
];

// --- Component Props ---
interface ResultsBarProps {
    resultCount: number;
    totalCount: number;
    sortBy: string;
    // The prop expects a function that takes only the selected string value
    onSortChange: (value: string) => void;
}

export const ResultsBar = ({ resultCount, totalCount, sortBy, onSortChange }: ResultsBarProps) => {
    // --- State and Refs for the custom dropdown ---
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Find the label of the currently selected value to display it
    const selectedLabel = sortOptions.find(option => option.value === sortBy)?.label || sortOptions[0]?.label;

    // Effect to handle closing the dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handler to update parent state and close the dropdown
    const handleSelect = (value: string) => {
        onSortChange(value);
        setIsOpen(false);
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between my-3 px-6 gap-4">
            {/* Results count text */}
            <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-neutral-800">{resultCount}</span> of <span className="font-semibold text-neutral-800">{totalCount}</span> results
            </p>

            {/* Custom Dropdown for Sorting */}
            <div className="flex items-center gap-3">
                <label 
                    className="text-sm font-medium text-gray-600 flex-shrink-0">
                        Sort by:
                </label>
                
                <div className="relative w-full" ref={dropdownRef}>
                    {/* The button that shows the current selection and toggles the dropdown */}
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center justify-between w-full min-w-[200px] 
                            px-3 py-2 bg-neutral-100
                            rounded-lg text-sm text-neutral-800 focus:outline-none 
                            ring ring-gray-300 focus:ring-neutral-400 focus:border-teal-500 
                            transition-colors hover:bg-neutral-200 cursor-pointer"
                        aria-haspopup="listbox"
                        aria-expanded={isOpen}
                    >
                        <span>{selectedLabel}</span>
                        <ChevronDown
                            size={16}
                            className={`ml-4 text-gray-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {/* The animated dropdown list */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.15 }}
                                className="absolute top-full right-0 w-full mt-1 bg-neutral-100 
                                    border border-neutral-300 rounded-lg z-10 overflow-hidden"
                            >
                                <ul 
                                    className="max-h-60 overflow-y-auto" 
                                    role="listbox"
                                >
                                    {sortOptions.map((option) => (
                                        <li key={option.value}>
                                            <button
                                                type="button"
                                                onClick={() => handleSelect(option.value)}
                                                className={`w-full text-left px-3 py-2 text-sm 
                                                    transition-colors ${
                                                    sortBy === option.value
                                                        ? 'bg-teal-600 text-white'
                                                        : 'text-neutral-800 cursor-pointer hover:bg-teal-600 hover:text-white'
                                                }`}
                                                role="option"
                                                aria-selected={sortBy === option.value}
                                            >
                                                {option.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};