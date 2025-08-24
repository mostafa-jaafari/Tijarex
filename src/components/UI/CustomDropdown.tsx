"use client";
import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface CustomDropdownProps {
    label: string;
    options: string[];
    selectedValue: string;
    onSelect: (value: string) => void;
}

export const CustomDropdown = ({ label, options, selectedValue, onSelect }: CustomDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // This effect handles closing the dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Cleanup the event listener on component unmount
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (option: string) => {
        onSelect(option);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
                {label}
            </label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-3 
                    py-2.5 bg-neutral-800 border border-neutral-700 
                    rounded-lg text-sm text-neutral-200 
                    focus:outline-none focus:ring focus:ring-neutral-100 
                    focus:border-neutral-500 transition-colors 
                    hover:bg-neutral-700
                    cursor-pointer"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span>{selectedValue}</span>
                <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-10 overflow-hidden"
                    >
                        <ul className="max-h-60 overflow-y-auto" role="listbox">
                            {options.map((option) => (
                                <li key={option}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(option)}
                                        className={`w-full cursor-pointer text-left px-3 py-2 text-sm transition-colors 
                                            ${selectedValue === option
                                                ? 'bg-neutral-600 text-white'
                                                : 'text-neutral-200 hover:bg-neutral-600 hover:text-white'
                                        }`}
                                        role="option"
                                        aria-selected={selectedValue === option}
                                    >
                                        {option}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};