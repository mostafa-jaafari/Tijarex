"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Props now expect a simple array of strings.
interface SizeInputProps {
  sizes: string[];
  setSizes: React.Dispatch<React.SetStateAction<string[]>>;
}

export const SizeInput: React.FC<SizeInputProps> = ({ sizes, setSizes }) => {
    const [currentValue, setCurrentValue] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Add size on Enter or Comma
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newSize = currentValue.trim().toUpperCase(); // Keep auto-uppercase for consistency

            // Add the new size if it's not empty and not already in the list
            if (newSize && !sizes.some(s => s.toUpperCase() === newSize)) {
                setSizes([...sizes, newSize]);
            }
            
            // Clear the input field
            setCurrentValue('');
        }
    };
    
    // The remove logic now filters the array of strings directly
    const removeSize = (sizeToRemove: string) => {
        setSizes(sizes.filter(size => size !== sizeToRemove));
    };

    return (
        <div 
            className="flex items-center gap-1.5 border 
                border-neutral-200 focus:border-neutral-400 
                p-1.5 rounded-md"
        >
            <AnimatePresence>
                {sizes.map((size) => (
                    <motion.div
                        key={size} // Use the size string itself as the key
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="w-max flex items-center gap-1.5 bg-gray-100 
                            text-gray-700 text-sm font-medium p-1.5 
                            rounded-md"
                    >
                        {/* Display the size string directly */}
                        <span>{size}</span>
                        <button 
                            type="button" 
                            onClick={() => removeSize(size)} 
                            className="text-neutral-500 cursor-pointer hover:text-neutral-800"
                        >
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
                placeholder={sizes.length === 0 ? "e.g., S, M, XL..." : "+ Add"}
                className="outline-none text-sm"
            />
        </div>
    );
};