// /hooks/useCart.ts

"use client";

import { useState, useEffect, useCallback } from 'react';
import { addProductToCart, removeProductFromCart as removeProductFromCartService, getCart, CartItem } from './cartService';

const CART_KEY = 'shoppingCart';

export function useCart() {
    // Initialize state lazily from localStorage only on the first client-side render
    const [cart, setCart] = useState<CartItem[]>(() => {
        if (typeof window === 'undefined') {
            return [];
        }
        try {
            const stored = window.localStorage.getItem(CART_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    // This callback handles the storage event, keeping the state in sync
    const handleStorageChange = useCallback((event: StorageEvent) => {
        // Update state only if our specific cart key has changed
        if (event.key === CART_KEY && event.newValue) {
            try {
                setCart(JSON.parse(event.newValue));
            } catch (error) {
                console.error("Failed to update cart from storage event", error);
                setCart([]);
            }
        }
    }, []);

    // This effect sets up the listener that makes the hook "realtime"
    // across different browser tabs and also listens for our manual dispatch.
    useEffect(() => {
        window.addEventListener('storage', handleStorageChange);
        // Cleanup function to remove the listener when the component unmounts
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [handleStorageChange]);

    // Create a new async function that orchestrates the entire removal process.
    const removeFromCart = async (itemId: string) => {
        // 1. Call the service to update localStorage. We rename the import to avoid name collision.
        await removeProductFromCartService(itemId);

        // 2. Directly get the updated cart from localStorage.
        const updatedCart = getCart();

        // 3. Update the React state, which will cause an instant re-render.
        setCart(updatedCart);
    };

    // Expose the cart state and the new, more reliable functions
    return {
        cart,
        addToCart: addProductToCart, // This can be wrapped similarly if needed, but the current method works
        removeFromCart: removeFromCart, // We now export our new function
    };
}