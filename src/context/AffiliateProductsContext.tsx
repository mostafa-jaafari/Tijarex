"use client";

import { AffiliateProduct } from "@/types/product";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState, useMemo } from "react";

// 1. DEFINE THE CONTEXT SHAPE
// We can also add a function to allow manual refetching from child components.
type AffiliateProductsContextType = {
    affiliateProducts: AffiliateProduct[];
    isAffiliateProductsLoading: boolean;
    refetchAffiliateProducts: () => void;
};

// 2. CREATE THE CONTEXT
// Creating it with `undefined` is a standard pattern to ensure it's used within a provider.
const AffiliateProductsContext = createContext<AffiliateProductsContextType | undefined>(undefined);


// 3. CREATE THE PROVIDER COMPONENT
export const AffiliateProductsContextProvider = ({ children }: { children: ReactNode; }) => {
    const { status } = useSession(); // status can be: "loading", "authenticated", "unauthenticated"

    const [affiliateProducts, setAffiliateProducts] = useState<AffiliateProduct[]>([]);
    const [isAffiliateProductsLoading, setIsAffiliateProductsLoading] = useState<boolean>(true);

    // useCallback memoizes the fetch function. It will only be recreated if `status` changes.
    const fetchAffiliateProducts = useCallback(async () => {
        // If the user is not logged in, we don't need to fetch anything.
        // Ensure state is clean and stop loading.
        if (status !== "authenticated") {
            setAffiliateProducts([]);
            setIsAffiliateProductsLoading(false);
            return;
        }
        
        // Set loading to true at the very start of an authenticated fetch attempt.
        setIsAffiliateProductsLoading(true);

        try {
            const response = await fetch('/api/affiliate/affiliateproducts');
            if (!response.ok) {
                throw new Error(`Failed to fetch products. Status: ${response.status}`);
            }
            const data: AffiliateProduct[] = await response.json();
            setAffiliateProducts(data);
        } catch (err) {
            console.error("Error fetching affiliate products:", err);
            // In case of an error, clear products to avoid showing stale/incorrect data.
            setAffiliateProducts([]);
        } finally {
            // This ALWAYS runs, ensuring the loading state is turned off after the attempt.
            setIsAffiliateProductsLoading(false);
        }
    }, [status]); // The dependency array ensures this function is updated when auth status changes.

    // useEffect to decide WHEN to call the fetch function.
    useEffect(() => {
        // When the session status is determined (either authenticated or not), we run the fetch logic.
        if (status !== "loading") {
            fetchAffiliateProducts();
        } else {
            // While the session is loading, we should be in a loading state.
            setIsAffiliateProductsLoading(true);
        }
    }, [status, fetchAffiliateProducts]);

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