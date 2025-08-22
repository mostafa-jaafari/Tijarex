import React from 'react';
import { RefreshCw } from 'lucide-react';

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
        <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm mb-6 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-800">Filter Products</h3>
                <button
                    onClick={onClear}
                    className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Clear All
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {productFilters.map((filter) => (
                    <div key={filter.title}>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">{filter.title}</label>
                        <select
                            value={selectedFilters[filter.title] || 'All'}
                            onChange={(e) => onFilterSelect(filter.title, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            {filter.filters.map(item => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
};