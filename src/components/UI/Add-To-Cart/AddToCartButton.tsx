"use client";

import { useCart } from "./useCart";
import { Loader2, ShoppingCart } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface AddToCartButtonProps {
  productId: string;
  quantity: number;
  stock: number;
  availableColors: string[];
  selectedColor: string | null;
  availableSizes: string[];
  selectedSize: string | null;
}

export function AddToCartButton({
  productId,
  quantity,
  stock,
  availableColors,
  selectedColor,
  availableSizes,
  selectedSize,
}: AddToCartButtonProps) {
  const { addToCart } = useCart(); // Get the addToCart function from your hook
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    // --- VALIDATION CHECKS ---
    if (stock <= 0) {
      toast.error("This product is out of stock.");
      return;
    }
    if (quantity <= 0) {
      toast.error("Please select a quantity greater than zero.");
      return;
    }
    if (quantity > stock) {
      toast.error(`Only ${stock} items are available in stock.`);
      return;
    }
    if (availableColors.length > 0 && !selectedColor) {
      toast.error("Please select a color.");
      return;
    }
    if (availableSizes.length > 0 && !selectedSize) {
      toast.error("Please select a size.");
      return;
    }
    
    setIsAdding(true);
    try {
      // Assuming your addToCart function is updated to handle quantity and options
      // Example signature: addToCart(productId: string, quantity: number, options?: { color?: string; size?: string })
      await addToCart(productId, quantity, { color: selectedColor, size: selectedSize });
      toast.success(`${quantity} item(s) added to your cart.`);
    } catch (error) {
      toast.error("Could not add product to cart.");
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || stock <= 0}
      className={`flex-1 flex items-center justify-center gap-2 text-white text-sm font-semibold py-3 rounded-lg bg-purple-700 hover:bg-purple-800 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed`}
    >
      {isAdding ? (
        <>
          <Loader2 size={18} className="animate-spin" /> Adding...
        </>
      ) : (
        <>
          <ShoppingCart size={18} /> Add to Cart
        </>
      )}
    </button>
  );
}