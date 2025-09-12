// src/hooks/useTrendingProducts.ts
"use client";

import { useMarketplaceProducts } from '@/context/MarketplaceProductsContext';
import { useMemo } from 'react';

// --- Configuration: You can easily tweak these values to change what "trending" means ---

// The weight given to total sales volume. A higher number means sales matter more.
const SALES_WEIGHT = 0.6; 
// The weight given to how new a product is. A higher number means recency matters more.
const RECENCY_WEIGHT = 0.4;
// A product must have at least this many sales to be considered "truly" trending.
const MINIMUM_SALES_FOR_TRENDING = 100;


/**
 * A custom hook to filter and sort products to find the most popular or "trending" items.
 *
 * @param {number} count The number of trending products to return.
 * @returns An object containing the list of trending products and a loading state.
 */
export const useTrendingProducts = (count: number = 8) => {
    // 1. Get the raw product data from the global context
    const { marketplaceProductsData, isLoadingMarketplaceProducts } = useMarketplaceProducts();

    // 2. Memoize the calculation to prevent re-running on every render
    const trendingProducts = useMemo(() => {
        // Return an empty array if there's no data to process
        if (!marketplaceProductsData || marketplaceProductsData.length === 0) {
            return [];
        }

        // --- Step A: Calculate a "trending score" for every product ---
        const productsWithScores = marketplaceProductsData.map(product => {
            const salesScore = product.sales || 0;

            const now = new Date();
            const affiliateCreatedAt = product.AffiliateInfos?.AffiliateInfo?.AffiliateCreatedAt;
            const createdAt = affiliateCreatedAt ? new Date(affiliateCreatedAt.toDate()) : new Date();
            // Calculate how many days old the product is. Use Math.max to prevent division by zero.
            const daysSinceCreation = Math.max((now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24), 1);
            
            // The score is higher for newer products (an inverse relationship with age).
            // We multiply by 100 to give it a more significant value relative to sales.
            const recencyScore = (1 / daysSinceCreation) * 100;

            // Combine the scores using our weights
            const trendingScore = (salesScore * SALES_WEIGHT) + (recencyScore * RECENCY_WEIGHT);

            return { ...product, trendingScore };
        });

        // --- Step B: Sort all products by their new score in descending order ---
        productsWithScores.sort((a, b) => b.trendingScore - b.trendingScore);

        // --- Step C: Implement the "no empty results" fallback logic ---

        // First, try to find products that meet our "truly trending" criteria
        let topProducts = productsWithScores.filter(
            p => p.sales >= MINIMUM_SALES_FOR_TRENDING
        );

        // **This is the key to fulfilling your request:**
        // If we didn't find enough "truly trending" products, we ignore the threshold
        // and use the top-scored products as a fallback.
        if (topProducts.length < count) {
            topProducts = productsWithScores.slice(0, count);
        }

        // 3. Return the final list, ensuring it doesn't exceed the requested count
        return topProducts.slice(0, count);

    }, [marketplaceProductsData, count]); // The dependency array ensures this runs only when data changes

    return {
        trendingProducts,
        isLoading: isLoadingMarketplaceProducts,
    };
};