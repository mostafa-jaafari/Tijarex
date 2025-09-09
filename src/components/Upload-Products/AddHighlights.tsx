"use client";

import { X } from "lucide-react";
import { useState } from "react";



export const Highlights: React.FC<{ highlights: string[]; setHighlights: React.Dispatch<React.SetStateAction<string[]>> }> = ({ highlights, setHighlights }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddHighlight = () => {
    if (inputValue.trim() !== '' && highlights.length < 10) {
      setHighlights([...highlights, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full bg-white ring ring-purple-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] rounded-lg">
      <h3 className="py-2.5 px-6 border-b border-neutral-200 text-lg font-semibold text-neutral-800">
        Highlights
      </h3>
      <div className="p-4 space-y-3">
        <div 
            className="flex items-center gap-2 border 
                rounded overflow-hidden border-neutral-400">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a highlight..."
            className="w-full px-3 py-2 text-sm
                outline-none"
            maxLength={100}
          />
          <button
            type="button"
            onClick={handleAddHighlight}
            disabled={highlights.length >= 10 || !inputValue.trim()}
            className="px-4 py-2 text-sm
                text-white bg-neutral-800 border-l border-neutral-400
                hover:bg-neutral-700 disabled:bg-neutral-100 
                disabled:text-neutral-500 disabled:cursor-not-allowed 
                cursor-pointer transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-1">
          {highlights.map((highlight, index) => (
            <div 
                key={index} 
                className="flex items-center justify-between gap-3 
                    bg-purple-100 text-neutral-800 text-sm 
                    font-medium w-full rounded border 
                    border-neutral-400 pl-3"
            >
              <span>{highlight}</span>
              <button
                type="button"
                onClick={() => handleRemoveHighlight(index)}
                className="text-neutral-100 bg-neutral-800 py-2 px-2
                    h-full hover:text-neutral-200 cursor-pointer"
              >
                <X 
                    size={14}
                />
              </button>
            </div>
          ))}
        </div>
        {highlights.length >= 10 && (
          <p className="text-xs text-red-500">You have reached the maximum of 10 highlights.</p>
        )}
      </div>
    </div>
  );
};