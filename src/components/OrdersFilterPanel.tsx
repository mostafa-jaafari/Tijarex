"use client";

import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
// 1. Import the correct dropdown component
import { CustomDropdown } from '@/components/UI/CustomDropdown'; // Adjust the path if needed

// Define the filters you want to show
const orderFilters = [
    { title: "Status", filters: ["All", "completed", "pending", "shipped", "processing", "cancelled"] },
    // You can add more filters here, like "Payment", "Priority", etc.
];

// Animation variants for the dropdown items
const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
};

interface Props {
    selectedFilters: { [key: string]: string };
    onFilterSelect: (title: string, item: string) => void;
    onClear: () => void;
}

export const OrdersFilterPanel = ({ selectedFilters, onFilterSelect, onClear }: Props) => {
    return (
        <motion.div
            key="orders-filter-panel"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0, transition: { staggerChildren: 0.05, duration: 0.3, ease: 'easeInOut' } }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2, ease: 'easeOut' } }}
            className="p-6 rounded-b-lg border-b border-x border-neutral-700 -mt-2 bg-gradient-to-r from-[#1A1A1A] via-neutral-800 to-[#1A1A1A]"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-white">Filter Orders</h3>
                <button onClick={onClear} className="flex items-center gap-1.5 text-sm text-teal-500 hover:text-teal-400 font-medium transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" />
                    Clear All
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {orderFilters.map((filter) => (
                    <motion.div key={filter.title} variants={itemVariants}>
                        {/* 2. Use the CustomDropdown component with the correct props */}
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