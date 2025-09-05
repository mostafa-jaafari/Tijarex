"use client";
import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface CustomDropdownProps {
    label?: string;
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
        <div 
            ref={dropdownRef}
            className="relative"
        >
            <label className="block text-sm font-medium text-gray-400">
                {label}
            </label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                className="border-b border-neutral-400 ring ring-neutral-200
                    rounded-md text-sm text-neutral-700 capitalize
                    cursor-pointer hover:bg-neutral-50 flex items-center 
                    gap-3 px-3 bg-white"
            >
                <span className='text-nowrap'>{selectedValue}</span>
                <span className='border-r border-neutral-300 flex w-1 h-7' />
                <span
                    className=''
                >
                    <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform 
                            duration-200 
                            ${isOpen ? 'rotate-180' : ''}
                        `}
                    />
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 w-max mt-1
                            bg-neutral-50 border-b border-neutral-400/80
                            ring ring-neutral-200 shadow-sm 
                            rounded z-10 overflow-hidden"
                    >
                        <ul className="max-h-60 overflow-y-auto" role="listbox">
                            {options.map((option) => (
                                <li key={option}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(option)}
                                        className={`w-full cursor-pointer text-left px-6 py-1
                                            text-sm transition-colors 
                                            ${selectedValue === option
                                                ? 'bg-neutral-900 text-white'
                                                : 'text-neutral-500 hover:text-neutral-900'
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