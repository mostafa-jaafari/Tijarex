"use client";

import { ProductType } from "@/types/product";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

interface GlobalProductsContextTypes {
    globalProductsData: ProductType[]; // Always an array
    isLoadingGlobalProducts: boolean;
    refetch: () => void;
}

const GlobalProductsContext = createContext<GlobalProductsContextTypes | undefined>(undefined);

export const GlobalProductsProvider = ({ children }: { children: ReactNode; }) => {
    const [globalProductsData, setGlobalProductsData] = useState<ProductType[]>([]);
    const [isLoadingGlobalProducts, setIsLoadingGlobalProducts] = useState(true); // Start as true

    const fetchGlobalProducts = useCallback(async () => {
        setIsLoadingGlobalProducts(true);
        try {
            const res = await fetch('/api/products');
            if (!res.ok) {
                throw new Error("Failed to fetch Products data!");
            }
            const data = await res.json();
            setGlobalProductsData(data.products as ProductType[] || []);
        } catch (error) {
            console.error("Error in fetchGlobalProducts:", error);
            setGlobalProductsData([]);
        } finally {
            setIsLoadingGlobalProducts(false);
        }
    }, []); // Dependency is correct

    useEffect(() => {
        fetchGlobalProducts();
    }, [fetchGlobalProducts]);

    const contextValue = {
        globalProductsData,
        isLoadingGlobalProducts,
        refetch: fetchGlobalProducts,
    };

    // THE FIX IS HERE:
    // We ALWAYS return the Provider. The values inside it will change based
    // on the auth status, but the Provider wrapper will always exist for
    // any child component that needs it.
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