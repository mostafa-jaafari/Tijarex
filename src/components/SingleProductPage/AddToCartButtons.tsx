"use client";

import { ShoppingCart } from 'lucide-react';

export default function AddToCartButtons() {
    
  const handleAddToCart = () => {
    // Replace with your actual cart logic (e.g., using context)
    alert("Added to cart!");
  };

  return (
    <div className="mt-10 flex">
      <button
        type="button"
        onClick={handleAddToCart}
        className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-neutral-700 px-8 py-3 text-base font-medium text-white hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 sm:w-full"
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        Add to cart
      </button>
    </div>
  );
}