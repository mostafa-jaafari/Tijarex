import React from 'react';
import { X } from 'lucide-react';

export interface ColorOption {
  name: string;
  color: string;
}

interface ColorInputProps {
  colors: ColorOption[];
  setColors: React.Dispatch<React.SetStateAction<ColorOption[]>>;
}

export const ColorInput: React.FC<ColorInputProps> = ({ colors, setColors }) => {
  const addColor = () => {
    setColors([...colors, { name: '', color: '#000000' }]);
  };

  const updateColor = (index: number, field: keyof ColorOption, value: string) => {
    const newColors = [...colors];
    newColors[index][field] = value;
    setColors(newColors);
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {colors.map((color, index) => (
        <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
          <input
            type="color"
            value={color.color}
            onChange={(e) => updateColor(index, 'color', e.target.value)}
            className="w-10 h-10 border-none cursor-pointer rounded"
          />
          <input
            type="text"
            placeholder="Color Name (e.g., Black/White)"
            value={color.name}
            onChange={(e) => updateColor(index, 'name', e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button type="button" onClick={() => removeColor(index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full">
            <X size={18} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addColor}
        className="w-full px-4 py-2 text-sm font-medium text-blue-600 border border-dashed rounded-lg border-gray-400 hover:bg-blue-50"
      >
        + Add Color
      </button>
    </div>
  );
};