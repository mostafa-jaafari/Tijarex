"use client";

import { Check, Trash, Plus, GripVertical } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence, Reorder, useDragControls } from "framer-motion";

// --- Props Definition ---
interface HighlightsProps {
  highlights: string[];
  setHighlights: React.Dispatch<React.SetStateAction<string[]>>;
}

// --- Draggable Highlight Item Component ---
const HighlightItem = ({ highlight, onRemove }: { highlight: string; onRemove: () => void; }) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={highlight}
      dragListener={false} // Defer dragging to the handle
      dragControls={dragControls}
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0, margin: 0, padding: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex items-center w-full bg-white border 
        border-neutral-200 p-1 rounded-md hover:border-neutral-400 
        transition-colors"
    >
      <div 
        onPointerDown={(e) => dragControls.start(e)}
        className="cursor-grab touch-none p-1 text-gray-400 hover:text-gray-700"
        aria-label="Drag to reorder"
      >
        <GripVertical size={18} />
      </div>
      <Check size={18} className="text-green-500 flex-shrink-0 mx-2" />
      <span className="flex-grow truncate pr-2 font-medium text-gray-800">{highlight}</span>
      <button
        type="button"
        onClick={onRemove}
        className="flex-shrink-0 flex items-center justify-center w-7 h-7 text-gray-500 rounded-md hover:bg-red-100 hover:text-red-600 transition-colors"
        aria-label={`Remove "${highlight}"`}
      >
        <Trash size={16} />
      </button>
    </Reorder.Item>
  );
};


// --- Main Highlights Component ---
export const Highlights: React.FC<HighlightsProps> = ({ highlights, setHighlights }) => {
  const [inputValue, setInputValue] = useState('');
  const MAX_HIGHLIGHTS = 10;
  const MAX_CHARS = 100;

  const handleAddHighlight = () => {
    if (inputValue.trim() !== '' && highlights.length < MAX_HIGHLIGHTS) {
      setHighlights(prev => [inputValue.trim(), ...prev]);
      setInputValue('');
    }
  };

  const handleRemoveHighlight = (indexToRemove: number) => {
    setHighlights(prev => prev.filter((_, index) => index !== indexToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddHighlight();
    }
  };

  return (
    <div className="w-full space-y-3">
      
      {/* --- Input Section --- */}
      <div>
        <div className="relative flex items-center">
          <input
            id="highlight-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='e.g., "Free 2-Day Shipping"'
            className="w-full pl-3 pr-20 py-2 text-sm text-gray-900 
              border border-neutral-200 rounded-md
              focus:border-neutral-400 
              outline-none"
            maxLength={MAX_CHARS}
            disabled={highlights.length >= MAX_HIGHLIGHTS}
          />
          <div className="absolute right-1 h-full flex items-center gap-2">
            <span className="text-xs text-gray-400">{inputValue.length}/{MAX_CHARS}</span>
            <button
              type="button"
              onClick={handleAddHighlight}
              disabled={highlights.length >= MAX_HIGHLIGHTS || !inputValue.trim()}
              className="flex items-center justify-center h-[80%] px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              aria-label="Add highlight"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* --- Counter & Vertical List Section --- */}
      <div className="space-y-">
        <Reorder.Group axis="y" values={highlights} onReorder={setHighlights} className="space-y-2 min-h-[50px]">
          <AnimatePresence>
            {highlights.map((highlight, index) => (
              <HighlightItem 
                key={highlight} // NOTE: Keys must be unique to the item's content for reordering to work
                highlight={highlight} 
                onRemove={() => handleRemoveHighlight(index)} 
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>
      </div>

    </div>
  );
};