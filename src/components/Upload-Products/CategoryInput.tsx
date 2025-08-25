"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CategoryInputProps {
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

export const CategoryInput: React.FC<CategoryInputProps> = ({ categories, setCategories }) => {
    const [currentValue, setCurrentValue] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newCategory = currentValue.trim();
            if (newCategory && !categories.some(c => c.toLowerCase() === newCategory.toLowerCase())) {
                setCategories([...categories, newCategory]);
            }
            setCurrentValue('');
        }
    };
    
    const removeCategory = (indexToRemove: number) => {
        setCategories(categories.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="w-full p-2 bg-white border border-gray-300 rounded-lg flex flex-wrap items-center gap-2 focus-within:ring-2 focus-within:ring-teal-400 focus-within:border-teal-500 transition-all">
            <AnimatePresence>
                {categories.map((category, index) => (
                    <motion.div
                        key={category}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-md"
                    >
                        <span>{category}</span>
                        <button type="button" onClick={() => removeCategory(index)} className="text-gray-500 hover:text-gray-800">
                            <X size={14} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
            <input
                type="text"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={categories.length === 0 ? "e.g., Apparel, Tops..." : "+ Add"}
                className="flex-grow bg-transparent text-sm p-1.5 focus:outline-none placeholder:text-gray-400"
            />
        </div>
    );
};