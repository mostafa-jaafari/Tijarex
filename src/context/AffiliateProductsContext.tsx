"use client";

import { type AffiliateProductType } from "@/types/product";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState, useMemo } from "react";

// 1. DEFINE THE CONTEXT SHAPE
// We can also add a function to allow manual refetching from child components.
type AffiliateProductsContextType = {
    affiliateProducts: AffiliateProductType[];
    isAffiliateProductsLoading: boolean;
    refetchAffiliateProducts: () => void;
};

// 2. CREATE THE CONTEXT
// Creating it with `undefined` is a standard pattern to ensure it's used within a provider.
const AffiliateProductsContext = createContext<AffiliateProductsContextType | undefined>(undefined);


// 3. CREATE THE PROVIDER COMPONENT
export const AffiliateProductsContextProvider = ({ children }: { children: ReactNode; }) => {
    const [affiliateProducts, setAffiliateProducts] = useState<AffiliateProductType[]>([]);
    const [isAffiliateProductsLoading, setIsAffiliateProductsLoading] = useState<boolean>(true);

    // useCallback memoizes the fetch function. It will only be recreated if `status` changes.
    const fetchAffiliateProducts = useCallback(async () => {
        // Set loading to true at the very start of an authenticated fetch attempt.
        setIsAffiliateProductsLoading(true);

        try {
            const response = await fetch('/api/affiliate/collection-affiliate-products');
            if (!response.ok) {
                throw new Error(`Failed to fetch products. Status: ${response.status}`);
            }
            const data: AffiliateProductType[] = await response.json();
            setAffiliateProducts(data);
        } catch (err) {
            console.error("Error fetching affiliate products:", err);
            // In case of an error, clear products to avoid showing stale/incorrect data.
            setAffiliateProducts([]);
        } finally {
            // This ALWAYS runs, ensuring the loading state is turned off after the attempt.
            setIsAffiliateProductsLoading(false);
        }
    }, []); // The dependency array ensures this function is updated when auth status changes.

    // useEffect to decide WHEN to call the fetch function.
    useEffect(() => {
            fetchAffiliateProducts();
    }, [fetchAffiliateProducts]);

    // useMemo ensures the context value object is not recreated on every render,
    // preventing unnecessary re-renders in consumer components.
    const value = useMemo(() => ({
        affiliateProducts,
        isAffiliateProductsLoading,
        refetchAffiliateProducts: fetchAffiliateProducts,
    }), [affiliateProducts, isAffiliateProductsLoading, fetchAffiliateProducts]);

    return (
        <AffiliateProductsContext.Provider value={value}>
            {children}
        </AffiliateProductsContext.Provider>
    );
};

// 4. CREATE A CUSTOM HOOK (BEST PRACTICE)
// This makes using the context much cleaner and safer in other components.
export const useAffiliateProducts = () => {
    const context = useContext(AffiliateProductsContext);
    if (context === undefined) {
        throw new Error("useAffiliateProducts must be used within an AffiliateProductsContextProvider");
    }
    return context;
};