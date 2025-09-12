// in /context/GlobalProductsContext.tsx
"use client";

import { ProductType } from "@/types/product"; // Uses the revised ProductType
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

interface GlobalProductsContextTypes {
    globalProductsData: ProductType[];
    isLoadingGlobalProducts: boolean;
    isLoadingMore: boolean;
    hasMore: boolean;
    fetchMoreProducts: () => void;
    refetch: () => void;
}

const GlobalProductsContext = createContext<GlobalProductsContextTypes | undefined>(undefined);

export const GlobalProductsProvider = ({ children }: { children: ReactNode; }) => {
    const [globalProductsData, setGlobalProductsData] = useState<ProductType[]>([]);
    const [isLoadingGlobalProducts, setIsLoadingGlobalProducts] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [nextCursor, setNextCursor] = useState<string | null>(null);

    const fetchProducts = useCallback(async (cursor: string | null = null) => {
        if (cursor) {
            setIsLoadingMore(true);
        } else {
            setIsLoadingGlobalProducts(true);
        }

        try {
            // This API now correctly fetches only marketplace products
            const url = `/api/products?limit=10${cursor ? `&lastVisibleId=${cursor}` : ''}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch products data!");
            
            const data = await res.json();
            const newProducts = (data.products as ProductType[]) || [];

            setGlobalProductsData(prev => cursor ? [...prev, ...newProducts] : newProducts);
            setNextCursor(data.nextCursor);

        } catch (error) {
            console.error("Error in fetchProducts:", error);
        } finally {
            setIsLoadingGlobalProducts(false);
            setIsLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts(null);
    }, [fetchProducts]);

    const fetchMoreProducts = () => {
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
        hasMore: nextCursor !== null,
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