"use client";

import { Minus, Plus } from "lucide-react";
import React from "react";

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  stock: number;
}

export function QuantitySelector({ quantity, setQuantity, stock }: QuantitySelectorProps) {
  const handleDecrement = () => {
    // Prevent quantity from going below 1
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = () => {
    // Prevent quantity from exceeding available stock
    setQuantity((prev) => Math.min(stock, prev + 1));
  };

  return (
    <div 
      className="flex items-center border-b border-gray-400 
        ring ring-neutral-200 rounded-lg overflow-hidden">
      <button
        onClick={handleDecrement}
        disabled={quantity <= 1}
        className="p-3 text-gray-600 bg-neutral-100 h-full 
          hover:bg-teal-600/20 cursor-pointer 
          disabled:hover:bg-transparent
          transition-colors disabled:cursor-not-allowed disabled:text-gray-300"
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>

      <span className="px-5 font-semibold text-gray-800">{quantity}</span>

      <button
        onClick={handleIncrement}
        disabled={quantity >= stock}
        className="p-3 text-gray-600 bg-neutral-100 h-full 
          hover:bg-teal-600/20 cursor-pointer 
          transition-colors disabled:cursor-not-allowed disabled:text-gray-300"
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}