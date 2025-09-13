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
    const [nextCursor, setNextCursor] = useState<string | null>(null);

    const fetchProducts = useCallback(async (cursor: string | null = null) => {
        if (cursor) setIsLoadingMore(true);
        else setIsLoadingAffiliateAvailableProducts(true);

        try {
            // ⭐️ FIX: The URL has been corrected to point to the right API endpoint.
            // Removed the extra "/products" from the path.
            const url = `/api/products/affiliate-available-products?limit=10${cursor ? `&lastVisibleId=${cursor}` : ''}`;
            
            const res = await fetch(url);
            if (!res.ok) {
                // This error will now only be thrown for legitimate server errors (like 500), not 404.
                throw new Error("Failed to fetch affiliate-available products data!");
            }
            
            const data = await res.json();
            console.log('Fetched affiliate products:', data);
            const newProducts = (data.products as ProductType[]) || [];

            setAffiliateAvailableProductsData(prev => cursor ? [...prev, ...newProducts] : newProducts);
            setNextCursor(data.nextCursor);

        } catch (error) {
            console.error("Error in fetchProducts (Affiliate-Available):", error);
        } finally {
            setIsLoadingAffiliateAvailableProducts(false);
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
        setAffiliateAvailableProductsData([]);
        setNextCursor(null);
        fetchProducts(null);
    }, [fetchProducts]);

    const contextValue = {
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

export function useAffiliateAvailableProducts() {
    const context = useContext(AffiliateAvailableProductsContext);
    if (!context) {
        throw new Error("useAffiliateAvailableProducts must be used within an AffiliateAvailableProductsProvider");
    }
    return context;
}