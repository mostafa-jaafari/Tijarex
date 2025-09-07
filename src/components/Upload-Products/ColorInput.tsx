"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// The props now expect a simple array of strings.
interface ColorInputProps {
  colors: string[];
  setColors: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ColorInput: React.FC<ColorInputProps> = ({ colors, setColors }) => {
    const [currentValue, setCurrentValue] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Add color on Enter or Comma
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newColor = currentValue.trim();

            // Add the new color if it's not empty and not already in the list
            if (newColor && !colors.some(c => c.toLowerCase() === newColor.toLowerCase())) {
                setColors([...colors, newColor]);
            }
            
            // Clear the input field
            setCurrentValue('');
        }
    };
    
    // The remove logic is simpler as we just filter the array of strings
    const removeColor = (colorToRemove: string) => {
        setColors(colors.filter(color => color !== colorToRemove));
    };

    return (
        <div 
            className="w-full px-2 py-1 bg-white border-b 
                border-neutral-400 ring ring-neutral-200
                rounded-lg flex flex-wrap items-center gap-2 
                focus-within:border-b-2 focus-within:ring-purple-400 
                focus-within:border-purple-600 transition-all">
            <AnimatePresence>
                {colors.map((color) => (
                    <motion.div
                        key={color} // Use the color name itself as the key
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="flex items-center gap-1.5 text-neutral-700 text-sm font-medium px-3 py-1.5 rounded-md"
                    >
                        {/* Display the color string directly */}
                        <div 
                            className='flex items-center gap-1'
                        >
                            <span 
                                className='flex w-3 h-3'
                                style={{ backgroundColor: color }}
                            />
                            {color}
                        </div> 
                        <button 
                            type="button" 
                            onClick={() => removeColor(color)}
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
                placeholder={colors.length === 0 ? "e.g., Black, White..." : "+ Add"}
                className="flex-grow bg-transparent text-sm p-1.5 focus:outline-none placeholder:text-neutral-400"
            />
        </div>
    );
};