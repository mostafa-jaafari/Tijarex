import React from 'react';
import { X } from 'lucide-react';

interface ActiveFiltersProps {
    selectedFilters: { [key: string]: string };
    onClearFilter: (title: string, item: string) => void;
    onClearAll: () => void;
}

export const ActiveFilters = ({ selectedFilters, onClearFilter, onClearAll }: ActiveFiltersProps) => {
    const activeFilters = Object.entries(selectedFilters);

    if (activeFilters.length === 0) return null;

    return (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700">Active:</span>
            {activeFilters.map(([key, value]) => (
                <div key={key} className="flex items-center gap-1.5 bg-gray-100 text-gray-800 text-sm font-medium pl-3 pr-2 py-1 rounded-full">
                    <span>{key}: <span className="font-normal">{value}</span></span>
                    <button 
                        onClick={() => onClearFilter(key, 'All')} 
                        className="p-0.5 rounded-full hover:bg-gray-300"
                        aria-label={`Remove ${key} filter`}
                    >
                        <X size={14} />
                    </button>
                </div>
            ))}
            <button 
                onClick={onClearAll}
                className="text-sm text-blue-600 hover:underline font-medium ml-2"
            >
                Clear all
            </button>
        </div>
    );
};