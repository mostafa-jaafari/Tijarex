"use client";

import React from 'react';
import { InputStyles } from '@/app/[locale]/page';

// --- PROPS ARE NOW FOR A SINGLE STRING ---
interface SingleCategoryInputProps {
  category: string;
  setCategory: (value: string) => void;
}

export const CategoryInput: React.FC<SingleCategoryInputProps> = ({ category, setCategory }) => {
    return (
        // The main container is now 'relative' to position the clear button
        <div className="relative w-full">
            <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Apparel"
                // The styling is adjusted for a single input with an icon inside
                className={InputStyles}
            />
        </div>
    );
};