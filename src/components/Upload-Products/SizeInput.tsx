import React from 'react';
import { X } from 'lucide-react';

export interface SizeOption {
  label: string;
  available: boolean;
}

interface SizeInputProps {
  sizes: SizeOption[];
  setSizes: React.Dispatch<React.SetStateAction<SizeOption[]>>;
}

export const SizeInput: React.FC<SizeInputProps> = ({ sizes, setSizes }) => {
  const addSize = () => {
    setSizes([...sizes, { label: '', available: true }]);
  };

  const updateSize = (index: number, value: string) => {
    const newSizes = [...sizes];
    newSizes[index].label = value.toUpperCase();
    setSizes(newSizes);
  };

  const toggleAvailability = (index: number) => {
    const newSizes = [...sizes];
    newSizes[index].available = !newSizes[index].available;
    setSizes(newSizes);
  };
  
  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {sizes.map((size, index) => (
        <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
          <input
            type="text"
            placeholder="Size (e.g., XL)"
            value={size.label}
            onChange={(e) => updateSize(index, e.target.value)}
            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="flex items-center flex-grow pl-2">
            <input
              type="checkbox"
              id={`size-${index}`}
              checked={size.available}
              onChange={() => toggleAvailability(index)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor={`size-${index}`} className="ml-2 text-sm text-gray-700">
              Available
            </label>
          </div>
          <button type="button" onClick={() => removeSize(index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full">
            <X size={18} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addSize}
        className="w-full px-4 py-2 text-sm font-medium text-blue-600 border border-dashed rounded-lg border-gray-400 hover:bg-blue-50"
      >
        + Add Size
      </button>
    </div>
  );
};