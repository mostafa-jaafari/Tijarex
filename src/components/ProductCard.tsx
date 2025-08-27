"use client";

import React, { useState, useEffect } from 'react';
import { ProductType } from '@/types/product';
import { useUserInfos } from '@/context/UserInfosContext';
import { useQuickViewProduct } from '@/context/QuickViewProductContext';
import { toast } from 'sonner';
import { ProductCardUI } from './UI/ProductCardUI';

// --- Props for the Container Component ---
interface ProductCardProps {
    product: ProductType;
    onAddToStore: (product: ProductType) => void;
    onUnfavorited?: (productId: string) => void;
}

export const ProductCard = ({ product, onAddToStore }: ProductCardProps) => {
    // --- All Hooks and Logic Live Here ---
    const { userInfos, refetch } = useUserInfos(); // Assuming a refetch function exists
    const { setIsShowQuickViewProduct, setProductID } = useQuickViewProduct();

    // The 'isFavorite' state is managed by this smart component
    const [isFavorite, setIsFavorite] = useState(
        userInfos?.favoriteProductIds?.includes(product.id) || false
    );

    // Effect to sync favorite status if userInfos changes (e.g., after login)
    useEffect(() => {
        setIsFavorite(userInfos?.favoriteProductIds?.includes(product.id) || false);
    }, [userInfos, product.id]);


    // --- All Functions with Logic Live Here ---
    const handleQuickView = () => {
        setProductID(product.id as string || "");
        setIsShowQuickViewProduct(true);
    };

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const previousIsFavorite = isFavorite;
        setIsFavorite(prev => !prev); // Optimistic UI update

        try {
            // CORRECTED API ROUTE: In previous steps we created /api/user/favorites
            const response = await fetch('/api/products/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: product.id }),
            });

            if (!response.ok) {
                // The API will send a specific error message if it can
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update favorites.');
            }
            
            const result = await response.json();
            setIsFavorite(result.isFavorite); // Sync with server's response
            toast.success(result.isFavorite ? 'Added to favorites!' : 'Removed from favorites.');
            
            // Optionally, refetch user data to update context everywhere
            if(refetch) refetch(); 

        } catch (error) {
            setIsFavorite(previousIsFavorite); // Revert UI on failure
            toast.error((error as Error).message);
        }
    };

    const handleAddToStore = () => {
        onAddToStore(product);
    };

    // --- Render the UI component, passing down props ---
    return (
        <ProductCardUI
            product={product}
            isFavorite={isFavorite}
            isAffiliate={userInfos?.UserRole === "affiliate"}
            onToggleFavorite={handleToggleFavorite}
            onQuickView={handleQuickView}
            onAddToStore={handleAddToStore}
        />
    );
};