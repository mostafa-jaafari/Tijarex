"use client";

import { Check, Trash, GripVertical } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, Reorder, useDragControls } from "framer-motion";

// --- Type definition for a highlight item ---
export type Highlight = {
  id: number;
  text: string;
};

// --- Props Definition ---
interface HighlightsProps {
  highlights: Highlight[];
  setHighlights: React.Dispatch<React.SetStateAction<Highlight[]>>;
}

// --- Draggable Highlight Item Component ---
const HighlightItem = ({ highlight, onRemove }: { highlight: Highlight; onRemove: () => void; }) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={highlight} // The value is now the whole object for stable reordering
      dragListener={false}
      dragControls={dragControls}
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0, margin: 0, padding: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group flex items-center w-full border
        border-neutral-200 rounded-md hover:border-neutral-400 
        transition-colors"
    >
      <div 
        onPointerDown={(e) => dragControls.start(e)}
        className="cursor-grab touch-none group-hover:border-neutral-400 p-2 text-gray-400 
          border-r border-neutral-200 hover:text-gray-700"
        aria-label="Drag to reorder"
      >
        <GripVertical size={18} />
      </div>
      <Check size={18} className="text-green-500 flex-shrink-0 mx-1" />
      <span className="flex-grow truncate pr-2 font-medium text-gray-800">{highlight.text}</span> {/* Display the text property */}
      <button
        type="button"
        onClick={onRemove}
        className="flex-shrink-0 flex items-center 
          justify-center w-7 h-7 text-gray-500 
          rounded-md hover:bg-red-100 cursor-pointer
          hover:text-red-600 transition-colors"
        aria-label={`Remove "${highlight.text}"`}
      >
        <Trash size={16} />
      </button>
    </Reorder.Item>
  );
};


// --- Main Highlights Component ---
// CORRECTED: The props type annotation now matches the interface, fixing all type errors.
export const AddHighlights: React.FC<HighlightsProps> = ({ highlights, setHighlights }) => {
  const [inputValue, setInputValue] = useState('');
  const MAX_HIGHLIGHTS = 10;
  const MAX_CHARS = 100;

  const handleAddHighlight = () => {
    if (inputValue.trim() !== '' && highlights.length < MAX_HIGHLIGHTS) {
      // Create an object with a unique ID and the text
      const newHighlight: Highlight = {
        id: Date.now(), // Use a timestamp for a simple unique ID
        text: inputValue.trim(),
      };
      setHighlights(prev => [newHighlight, ...prev]);
      setInputValue('');
    }
  };

  const handleRemoveHighlight = (idToRemove: number) => { // Now removes by ID
    setHighlights(prev => prev.filter((highlight) => highlight.id !== idToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddHighlight();
    }
  };

  return (
    <div className="w-full">
      <div
        className="flex items-center justify-between
          text-xs font-medium text-gray-500 mb-1 px-1"
      >
        <span
          className=""
          >
          Press Enter after adding your Highlight
        </span>
        <p>
          {highlights.length}/{MAX_HIGHLIGHTS}
        </p>
      </div>
      {/* --- Input Section (No changes here) --- */}
      <div>
        <div className="relative flex items-center">
          <input
            id="highlight-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='e.g., "Free 2-Day Shipping"'
            className={`w-full pl-3 pr-20 py-2 text-sm text-gray-900 
              border border-neutral-200 rounded-md
              focus:border-neutral-400 
              outline-none ${highlights.length > 0 ? "mb-3" : "mb-0"}`}
            maxLength={MAX_CHARS}
            disabled={highlights.length >= MAX_HIGHLIGHTS}
          />
          <div className="absolute right-1 h-full flex items-center gap-2">
            <span className="text-xs text-gray-400">{inputValue.length}/{MAX_CHARS}</span>
          </div>
        </div>
      </div>
      
      {/* --- Counter & Vertical List Section --- */}
      <div className="space-y-">
        <Reorder.Group 
          axis="y" 
          values={highlights} 
          onReorder={setHighlights} 
          className="space-y-1 min-h-[50px]"
        >
          <AnimatePresence>
            {/* CORRECTED: The key is now stable and unique, which is essential for reordering. */}
            {highlights.map((highlight) => ( 
              <HighlightItem 
                key={highlight.id} 
                highlight={highlight}
                onRemove={() => handleRemoveHighlight(highlight.id)} 
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>
      </div>

    </div>
  );
};