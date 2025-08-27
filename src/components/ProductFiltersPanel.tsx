import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { CustomDropdown } from './UI/CustomDropdown';
import { PrimaryDark } from '@/app/[locale]/page';

const productFilters = [
    { title: "Category", filters: ["All", "Electronics", "Clothing", "Home & Garden", "Books"] },
    { title: "Stock Status", filters: ["All", "In Stock", "Low Stock", "Out of Stock"] },
    { title: "Price Range", filters: ["All", "Under 25Dh", "25Dh-50Dh", "50Dh-100Dh", "Over 100Dh"] },
];

// --- Animation Variants ---
const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
};

interface ProductFiltersPanelProps {
    selectedFilters: { [key: string]: string };
    onFilterSelect: (title: string, item: string) => void;
    onClear: () => void;
}

export const ProductFiltersPanel = ({ selectedFilters, onFilterSelect, onClear }: ProductFiltersPanelProps) => {
    return (
        <motion.div
            // Key is important for AnimatePresence to track the component
            key="filters-panel"
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`mt-3 bg-gradient-to-tr ${PrimaryDark} p-6 rounded-lg border border-gray-700`}
        >
            <div className="flex items-center justify-between mb-4">
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
                    // Each dropdown is now a motion component to be staggered
                    <motion.div key={filter.title} variants={itemVariants}>
                        <CustomDropdown
                            label={filter.title}
                            options={filter.filters}
                            selectedValue={selectedFilters[filter.title] || 'All'}
                            onSelect={(item) => onFilterSelect(filter.title, item)}
                        />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};