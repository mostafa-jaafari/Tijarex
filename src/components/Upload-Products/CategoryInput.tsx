"use client";

import React from 'react';
import { X } from 'lucide-react';

// --- PROPS ARE NOW FOR A SINGLE STRING ---
interface SingleCategoryInputProps {
  category: string;
  setCategory: (value: string) => void;
}

export const CategoryInput: React.FC<SingleCategoryInputProps> = ({ category, setCategory }) => {

    // The handler to clear the input field
    const handleClear = () => {
        setCategory('');
    };

    return (
        // The main container is now 'relative' to position the clear button
        <div className="relative w-full">
            <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Apparel"
                // The styling is adjusted for a single input with an icon inside
                className="w-full p-3 pr-10 bg-white border border-gray-300 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500 placeholder:text-gray-400"
            />
            
            {/* --- CLEAR BUTTON --- */}
            {/* This button only appears when there is text in the input */}
            {category && (
                <button
                    type="button"
                    onClick={handleClear}
                    aria-label="Clear input"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800 transition-colors"
                >
                    <X size={18} />
                </button>
            )}
        </div>
    );
};