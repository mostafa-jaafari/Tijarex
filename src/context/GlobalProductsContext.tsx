// in /context/GlobalProductsContext.tsx

"use client";

import { ProductType } from "@/types/product";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

interface GlobalProductsContextTypes {
    globalProductsData: ProductType[];
    isLoadingGlobalProducts: boolean;
    isLoadingMore: boolean; // For loading next pages
    hasMore: boolean;       // To know if there are more products to fetch
    fetchMoreProducts: () => void; // Function to fetch the next page
    refetch: () => void;      // Function to reset and fetch from the start
}

const GlobalProductsContext = createContext<GlobalProductsContextTypes | undefined>(undefined);

export const GlobalProductsProvider = ({ children }: { children: ReactNode; }) => {
    const [globalProductsData, setGlobalProductsData] = useState<ProductType[]>([]);
    const [isLoadingGlobalProducts, setIsLoadingGlobalProducts] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [nextCursor, setNextCursor] = useState<string | null>(null);

    const fetchProducts = useCallback(async (cursor: string | null = null) => {
        // Set the appropriate loading state
        if (cursor) {
            setIsLoadingMore(true);
        } else {
            setIsLoadingGlobalProducts(true);
        }

        try {
            // Build the API URL with query parameters
            const url = `/api/products?limit=10${cursor ? `&lastVisibleId=${cursor}` : ''}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch products data!");
            
            const data = await res.json();
            const newProducts = (data.products as ProductType[]) || [];

            // If it's an initial fetch, replace the data. Otherwise, append it.
            setGlobalProductsData(prev => cursor ? [...prev, ...newProducts] : newProducts);
            setNextCursor(data.nextCursor);

        } catch (error) {
            console.error("Error in fetchProducts:", error);
        } finally {
            setIsLoadingGlobalProducts(false);
            setIsLoadingMore(false);
        }
    }, []);

    // Initial fetch on component mount
    useEffect(() => {
        fetchProducts(null);
    }, [fetchProducts]);

    const fetchMoreProducts = () => {
        // Prevent fetching if already loading or no more products
        if (isLoadingMore || !nextCursor) return;
        fetchProducts(nextCursor);
    };
    
    const refetch = useCallback(() => {
        setGlobalProductsData([]);
        setNextCursor(null);
        fetchProducts(null);
    }, [fetchProducts]);

    const contextValue = {
        globalProductsData,
        isLoadingGlobalProducts,
        isLoadingMore,
        hasMore: nextCursor !== null, // hasMore is true if nextCursor exists
        fetchMoreProducts,
        refetch,
    };

    return (
        <GlobalProductsContext.Provider value={contextValue}>
            {children}
        </GlobalProductsContext.Provider>
    );
};

export function useGlobalProducts() {
    const context = useContext(GlobalProductsContext);
    if (!context) {
        throw new Error("useGlobalProducts must be used within a GlobalProductsProvider");
    }
    return context;
}