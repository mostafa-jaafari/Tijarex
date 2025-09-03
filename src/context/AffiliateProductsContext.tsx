"use client";

import { type AffiliateProductType } from "@/types/product";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
// --- STEP 1: Import the useSession hook ---
import { useSession } from "next-auth/react";

// 1. Define the context's shape (no changes needed here)
interface AffiliateProductsContextType {
    affiliateProducts: AffiliateProductType[];
    isAffiliateProductsLoading: boolean;
    refetchAffiliateProducts: () => void;
};

// 2. Create the context (no changes needed here)
const AffiliateProductsContext = createContext<AffiliateProductsContextType | undefined>(undefined);

// 3. Create the Provider Component
export const AffiliateProductsContextProvider = ({ children }: { children: ReactNode; }) => {
    const [affiliateProducts, setAffiliateProducts] = useState<AffiliateProductType[]>([]);
    const [isAffiliateProductsLoading, setIsAffiliateProductsLoading] = useState(true);

    // --- STEP 2: Get the user's session status ---
    // `status` will be 'loading', 'authenticated', or 'unauthenticated'.
    const { status } = useSession();

    // `useCallback` memoizes the function
    const fetchAffiliateProducts = useCallback(async () => {
        setIsAffiliateProductsLoading(true);
        try {
            const response = await fetch('/api/affiliate/collection-affiliate-products');
            
            if (!response.ok) {
                // If the response is 401 Unauthorized, we can log it but we won't show an error toast
                // because it's an expected state for a logged-out user.
                if (response.status === 401) {
                    console.log("User not authenticated. Skipping affiliate product fetch.");
                    setAffiliateProducts([]); // Ensure data is cleared
                    return; // Exit the function early
                }
                throw new Error(`Failed to fetch products. Status: ${response.status}`);
            }
            
            const data: AffiliateProductType[] = await response.json();
            setAffiliateProducts(data || []);
        } catch (error) {
            console.error("Error in fetchAffiliateProducts:", error);
            setAffiliateProducts([]);
        } finally {
            setIsAffiliateProductsLoading(false);
        }
    }, []);

    // --- STEP 3: Make the useEffect hook smarter ---
    // This hook now decides WHEN to call the fetch function.
    useEffect(() => {
        // We only want to fetch data if the user is definitively logged in.
        if (status === 'authenticated') {
            fetchAffiliateProducts();
        }
        
        // If the user is definitively logged out, we don't fetch.
        // We just clear the data and stop the loading spinner.
        if (status === 'unauthenticated') {
            setAffiliateProducts([]);
            setIsAffiliateProductsLoading(false);
        }
        
        // If the status is 'loading', we do nothing and wait for the status to resolve.
    }, [status, fetchAffiliateProducts]); // This effect now runs whenever the auth status changes

    // Create the value object to pass to the provider (no changes needed here)
    const contextValue = {
        affiliateProducts,
        isAffiliateProductsLoading,
        refetchAffiliateProducts: fetchAffiliateProducts,
    };

    return (
        <AffiliateProductsContext.Provider value={contextValue}>
            {children}
        </AffiliateProductsContext.Provider>
    );
};

// 4. Create the custom hook (no changes needed here)
export const useAffiliateProducts = () => {
    const context = useContext(AffiliateProductsContext);
    if (context === undefined) {
        throw new Error("useAffiliateProducts must be used within an AffiliateProductsContextProvider");
    }
    return context;
};