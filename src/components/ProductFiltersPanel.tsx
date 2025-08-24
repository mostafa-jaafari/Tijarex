// /components/filters/ProductFiltersPanel.tsx (Updated)

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { CustomDropdown } from './UI/CustomDropdown';

const productFilters = [
    { title: "Category", filters: ["All", "Electronics", "Clothing", "Home & Garden", "Books"] },
    { title: "Stock Status", filters: ["All", "In Stock", "Low Stock", "Out of Stock"] },
    { title: "Price Range", filters: ["All", "Under $25", "$25-$50", "$50-$100", "Over $100"] },
    { title: "Commission Rate", filters: ["All", "5-10%", "10-15%", "15-20%", "20%+"] },
];

interface ProductFiltersPanelProps {
    selectedFilters: { [key: string]: string };
    onFilterSelect: (title: string, item: string) => void;
    onClear: () => void;
}

export const ProductFiltersPanel = ({ selectedFilters, onFilterSelect, onClear }: ProductFiltersPanelProps) => {
    return (
        <div 
            className="p-6 rounded-b-lg borderb border-x border-gray-200 -mt-2
                bg-gradient-to-r from-[#1A1A1A] via-neutral-800 to-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">Filter Products</h3>
                <button
                    onClick={onClear}
                    className="flex items-center gap-1.5 text-sm 
                        text-teal-500 hover:text-teal-400 font-medium 
                        cursor-pointer transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Clear All
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {productFilters.map((filter) => (
                    <CustomDropdown
                        key={filter.title}
                        label={filter.title}
                        options={filter.filters}
                        selectedValue={selectedFilters[filter.title] || 'All'}
                        onSelect={(item) => onFilterSelect(filter.title, item)}
                    />
                ))}
            </div>
        </div>
    );
};