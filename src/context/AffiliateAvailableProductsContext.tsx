"use client";

import { ProductType } from "@/types/product";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

interface AffiliateAvailableProductsContextTypes {
    affiliateAvailableProductsData: ProductType[];
    isLoadingAffiliateAvailableProducts: boolean;
    isLoadingMore: boolean;
    hasMore: boolean;
    fetchMoreProducts: () => void;
    refetch: () => void;
}

const AffiliateAvailableProductsContext = createContext<AffiliateAvailableProductsContextTypes | undefined>(undefined);

export const AffiliateAvailableProductsProvider = ({ children }: { children: ReactNode; }) => {
    const [affiliateAvailableProductsData, setAffiliateAvailableProductsData] = useState<ProductType[]>([]);
    const [isLoadingAffiliateAvailableProducts, setIsLoadingAffiliateAvailableProducts] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    // ⭐️ FIX: Initialize the cursor as `null` to represent the beginning.
    // Some logic might treat `undefined` differently than `null`.
    const [nextCursor, setNextCursor] = useState<string | null>(null);

    const fetchProducts = useCallback(async (cursor: string | null = null) => {
        // Set the correct loading state based on whether it's an initial fetch or a "load more" action.
        if (cursor) {
            setIsLoadingMore(true);
        } else {
            setIsLoadingAffiliateAvailableProducts(true);
        }

        try {
            const url = `/api/products/affiliate-available-products?limit=12${cursor ? `&lastVisibleId=${cursor}` : ''}`;
            
            const res = await fetch(url, { cache: "no-store" });

            if (!res.ok) {
                throw new Error("Failed to fetch affiliate-available products data!");
            }
            
            const data = await res.json();
            const newProducts: ProductType[] = data.products || [];

            // ⭐️ PRIMARY FIX: Add a client-side de-duplication check.
            // This prevents duplicate products from being added to the state, solving the UI bug.
            // The root cause is likely the API not correctly using the 'lastVisibleId',
            // but this makes your context robust against such issues.
            setAffiliateAvailableProductsData(prevProducts => {
                if (cursor) {
                    // This is a "load more" action.
                    // Create a Set of existing product IDs for a fast lookup.
                    const existingProductIds = new Set(prevProducts.map(p => p.id));
                    
                    // Filter the newly fetched products to only include ones we haven't seen before.
                    const uniqueNewProducts = newProducts.filter(p => !existingProductIds.has(p.id));

                    return [...prevProducts, ...uniqueNewProducts];
                } else {
                    // This is an initial fetch or a refetch, so just replace the data.
                    return newProducts;
                }
            });

            setNextCursor(data.nextCursor);

        } catch (error) {
            console.error("Error in fetchProducts (Affiliate-Available):", error);
        } finally {
            setIsLoadingAffiliateAvailableProducts(false);
            setIsLoadingMore(false);
        }
    }, []); // useCallback has no dependencies as it's self-contained.

    // Effect for the initial data load.
    useEffect(() => {
        fetchProducts(null);
    }, [fetchProducts]);

    const fetchMoreProducts = () => {
        // Prevent multiple simultaneous fetches.
        if (isLoadingMore || !nextCursor) {
            return;
        }
        fetchProducts(nextCursor);
    };
    
    // Resets the state and fetches the first page of data again.
    const refetch = useCallback(() => {
        setAffiliateAvailableProductsData([]);
        setNextCursor(null);
        fetchProducts(null);
    }, [fetchProducts]);

    const contextValue: AffiliateAvailableProductsContextTypes = {
        affiliateAvailableProductsData,
        isLoadingAffiliateAvailableProducts,
        isLoadingMore,
        hasMore: nextCursor !== null,
        fetchMoreProducts,
        refetch,
    };

    return (
        <AffiliateAvailableProductsContext.Provider value={contextValue}>
            {children}
        </AffiliateAvailableProductsContext.Provider>
    );
};

// Custom hook for consuming the context, ensuring it's used within a provider.
export function useAffiliateAvailableProducts() {
    const context = useContext(AffiliateAvailableProductsContext);
    if (context === undefined) {
        throw new Error("useAffiliateAvailableProducts must be used within an AffiliateAvailableProductsProvider");
    }
    return context;
}