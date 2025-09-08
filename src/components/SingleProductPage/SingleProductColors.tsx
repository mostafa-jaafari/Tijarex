"use client";
import { Check, Minus, Plus, ShoppingCart } from 'lucide-react';
import React, { useState } from 'react'

export function SingleProductColors({ ProductColors }: { ProductColors: string[]; }) {
    const [selectedColor, setSelectedColor] = useState<string>("");
    return (
        <div>
            {ProductColors.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-800">
                    Color: <span className="font-normal text-gray-600">{selectedColor}</span>
                    </h3>
                    <div className="flex items-center gap-3">
                    {ProductColors.map((col) => (
                        <button
                        key={col}
                        onClick={() => setSelectedColor(col)}
                        style={{ backgroundColor: col }}
                        className={`w-8 h-8 rounded-full border border-neutral-300 transition-all 
                            duration-200 flex items-center justify-center
                            ${
                            selectedColor === col
                                ? "ring-2 ring-offset-2 ring-purple-600 border-white"
                                : "hover:border-gray-300 cursor-pointer"
                        }`}
                        >
                        {selectedColor === col && <Check size={16} className="text-white" />}
                        </button>
                    ))}
                    </div>
                </div>
            )}
        </div>
    )
}


export function SingleProductSizes({ ProductSizes }: { ProductSizes: string[]; }) {
    const [selectedSize, setSelectedSize] = useState<string>("");
    return (
        <div>
            {ProductSizes.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-800">
                    Sizes: <span className="font-normal text-gray-600">{selectedSize}</span>
                  </h3>
                  <div className="flex items-center gap-3">
                    {ProductSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`rounded-lg border 
                          w-10 h-10 border-neutral-300 transition-all 
                          duration-200 flex items-center justify-center
                          ${
                            selectedSize?.toLowerCase() === size.toLowerCase()
                              ? "bg-purple-700 text-neutral-200"
                              : "bg-neutral-50 cursor-pointer"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
        </div>
    )
}



export function SingleProductQuantity() {
    const [quantity, setQuantity] = useState(1);
    return (
        <div
            className="flex items-center border-b border-gray-400 
                ring ring-neutral-200 rounded-lg overflow-hidden"
        >
            <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="py-3 px-3 h-full text-gray-600 hover:bg-gray-200 cursor-pointer"
            >
                <Minus size={16} />
            </button>
            <span className="px-4 py-3 font-semibold">{quantity}</span>
            <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-3 text-gray-600 hover:bg-gray-200 cursor-pointer"
            >
                <Plus size={16} />
            </button>
        </div>
    )
}