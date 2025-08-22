import React from 'react';

const sortOptions = [
    { label: "Most Relevant", value: "relevance" },
    { label: "Best Selling", value: "sales_desc" },
    { label: "Highest Commission", value: "commission_desc" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Newest Arrivals", value: "date_desc" },
];

interface ResultsBarProps {
    resultCount: number;
    totalCount: number;
    sortBy: string;
    onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const ResultsBar = ({ resultCount, totalCount, sortBy, onSortChange }: ResultsBarProps) => {
    return (
        <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-600">
                Showing <span className="font-bold text-gray-900">{resultCount}</span> of <span className="font-bold text-gray-900">{totalCount}</span> results
            </p>
            <div className="flex items-center gap-2">
                <label htmlFor="sort-by" className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                    id="sort-by"
                    value={sortBy}
                    onChange={onSortChange}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                    {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};