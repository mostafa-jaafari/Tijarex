"use client";

import { ProductType } from "@/types/product";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

interface MarketplaceProductsContextTypes {
    marketplaceProductsData: ProductType[];
    isLoadingMarketplaceProducts: boolean;
    isLoadingMore: boolean;
    hasMore: boolean;
    fetchMoreProducts: () => void;
    refetch: () => void;
}

const MarketplaceProductsContext = createContext<MarketplaceProductsContextTypes | undefined>(undefined);

export const MarketplaceProductsProvider = ({ children }: { children: ReactNode; }) => {
    const [marketplaceProductsData, setMarketplaceProductsData] = useState<ProductType[]>([]);
    const [isLoadingMarketplaceProducts, setIsLoadingMarketplaceProducts] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [nextCursor, setNextCursor] = useState<string | null>(null);

    const fetchProducts = useCallback(async (cursor: string | null = null) => {
        if (cursor) setIsLoadingMore(true);
        else setIsLoadingMarketplaceProducts(true);

        try {
            // ⭐️ FIX: Ensure this URL matches the new API route file name.
            const url = `/api/marketplace-products?limit=10${cursor ? `&lastVisibleId=${cursor}` : ''}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch marketplace products data!");
            
            const data = await res.json();
            const newProducts = (data.products as ProductType[]) || [];

            setMarketplaceProductsData(prev => cursor ? [...prev, ...newProducts] : newProducts);
            setNextCursor(data.nextCursor);

        } catch (error) {
            console.error("Error in fetchProducts (Marketplace):", error);
        } finally {
            setIsLoadingMarketplaceProducts(false);
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
        setMarketplaceProductsData([]);
        setNextCursor(null);
        fetchProducts(null);
    }, [fetchProducts]);

    const contextValue = {
        marketplaceProductsData,
        isLoadingMarketplaceProducts,
        isLoadingMore,
        hasMore: nextCursor !== null,
        fetchMoreProducts,
        refetch,
    };

    return (
        <MarketplaceProductsContext.Provider value={contextValue}>
            {children}
        </MarketplaceProductsContext.Provider>
    );
};

export function useMarketplaceProducts() {
    const context = useContext(MarketplaceProductsContext);
    if (!context) {
        throw new Error("useMarketplaceProducts must be used within a MarketplaceProductsProvider");
    }
    return context;
}