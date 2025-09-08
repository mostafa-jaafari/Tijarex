"use client";

import { ShoppingCart, X, PackageOpen } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, useMemo } from "react";
import { useCart } from "./UI/Add-To-Cart/useCart";
import { useGlobalProducts } from "@/context/GlobalProductsContext"; // Context to get product details
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

// This will be the new, fully-featured dropdown component
export function DropDownShoppingCart() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    // Get cart state and functions from your custom hooks
    const { cart, removeFromCart } = useCart();
    const { globalProductsData } = useGlobalProducts();

    // Memoize the calculation of cart details and subtotal for performance.
    // This only recalculates when the cart or product data changes.
    const { detailedCartItems, subtotal } = useMemo(() => {
        if (!globalProductsData || cart.length === 0) {
            return { detailedCartItems: [], subtotal: 0 };
        }

        const items = cart.map(cartItem => {
            const productDetails = globalProductsData.find(p => p.id === cartItem.productId);
            if (!productDetails) return null; // Handle case where product might not be found
            
            return {
                ...productDetails,
                ...cartItem,
            };
        }).filter(Boolean); // Filter out any null items

        const calculatedSubtotal = items.reduce((total, item) => {
            if (!item) return total;
            const price = item.original_sale_price || item.original_regular_price;
            return total + (price * item.quantity);
        }, 0);

        return { detailedCartItems: items, subtotal: calculatedSubtotal };

    }, [cart, globalProductsData]);
    
    // Calculate total number of items for the badge
    const cartCount = useMemo(() => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }, [cart]);

    // Close the dropdown when clicking outside of it
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);
    
    const handleRemoveItem = async (itemId: string) => {
        try {
            // Assuming your cart service has a remove function by the unique item ID
            await removeFromCart(itemId); 
            toast.success("Item removed from cart.");
        } catch (error) {
            toast.error(error as string);
        }
    };

    return (
        <section 
            ref={menuRef} 
            className="relative"
        >
            {/* Cart Icon Button with Badge */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative text-teal-700 hover:text-teal-600 
                  cursor-pointer"
                aria-label={`Open shopping cart with {cartCount} Dh items`}
            >
                <ShoppingCart size={20} />
                <AnimatePresence>
                    {cartCount > 0 && (
                        <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute px-1 left-3 -top-2 flex justify-center 
                                items-center rounded-full bg-teal-700 text-xs
                                text-neutral-200"
                        >
                            {cartCount}
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>
            
            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full p-4 flex 
                            flex-col gap-4 mt-3 w-80 sm:w-96 bg-white 
                            border border-gray-200 shadow-lg rounded-lg 
                            z-20"
                    >
                        <h3 
                            className="text-lg font-semibold text-neutral-700 
                                border-b border-neutral-200 pb-2"
                        >
                            Your Cart
                        </h3>
                        
                        {detailedCartItems.length > 0 ? (
                            <>
                                {/* Products List */}
                                <div className="flex flex-col gap-4 max-h-64 overflow-y-auto pr-2">
                                    {detailedCartItems.map((item) => (
                                        item ? (
                                            <div 
                                                key={item.id} 
                                                className="w-full flex items-start gap-4"
                                            >
                                                <div className="relative flex-shrink-0 w-16 h-16 rounded-md bg-gray-100 overflow-hidden">
                                                    <Image src={item.product_images[0] || '/placeholder.png'} alt={item.title} fill className="object-cover" />
                                                </div>
                                                <div className="flex-grow">
                                                    <p className="text-sm font-semibold text-black truncate">{item.title}</p>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {item.color && <span>Color: {item.color}</span>}
                                                        {item.size && <span>, Size: {item.size}</span>}
                                                    </div>
                                                    <p className="text-sm text-gray-700 mt-1">
                                                        Qty: {item.quantity} x <span className="font-medium">{(item.original_sale_price || item.original_regular_price).toFixed(2)} Dh</span>
                                                    </p>
                                                </div>
                                                <button onClick={() => handleRemoveItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : null
                                    ))}
                                </div>
                                
                                {/* Footer with Subtotal and Buttons */}
                                <div className="border-t border-neutral-200 pt-4 space-y-4">
                                    <div className="text-neutral-700 flex justify-between items-center font-semibold">
                                        <span>Subtotal:</span>
                                        <span className="text-teal-700">{subtotal.toFixed(2)} Dh</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Link href="/cart" onClick={() => setIsOpen(false)} className="w-full text-center py-2 px-4 text-sm font-semibold text-teal-700 bg-white border border-teal-700 rounded-md hover:bg-teal-50 transition-colors">
                                            View Cart
                                        </Link>
                                        <Link href="/checkout" onClick={() => setIsOpen(false)} className="w-full text-center py-2 px-4 text-sm font-semibold text-white bg-teal-700 rounded-md hover:bg-teal-800 transition-colors">
                                            Checkout
                                        </Link>
                                    </div>
                                </div>
                            </>
                        ) : (
                            // Empty Cart State
                            <div className="flex flex-col items-center justify-center text-center py-8">
                                <PackageOpen size={40} className="text-gray-300 mb-4" />
                                <h4 className="font-semibold text-black">Your cart is empty</h4>
                                <p className="text-sm text-gray-500 mt-1">Add products to see them here.</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}