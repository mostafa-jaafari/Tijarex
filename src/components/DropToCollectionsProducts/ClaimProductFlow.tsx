// src/components/DropToCollectionsProducts/ClaimProductFlow.tsx
"use client";

import { useState } from 'react';
import { ProductType } from '@/types/product';
import ProductEditor from './ProductEditor';
import { ProductEditorProvider } from '@/context/ProductEditorContext';
import { useAffiliateProducts } from '@/context/AffiliateProductsContext'; // Import the hook here
import { toast } from 'sonner';

interface ClaimProductFlowProps {
    sourceProduct: ProductType;
    onClose: () => void;
}

export default function ClaimProductFlow({ sourceProduct, onClose }: ClaimProductFlowProps) {
    const { refetchAffiliateProducts } = useAffiliateProducts(); // Get refetch function
    const [isSubmitting, setIsSubmitting] = useState(false); // Add a loading state

    // This is the function we will pass to the ProductEditor's onSave prop
    const handleSaveProduct = async (updates: Partial<ProductType>) => {
        setIsSubmitting(true);
        const toastId = toast.loading("Adding product to your collection...");

        try {
            // The data for the API call
            const payload = {
                originalProductId: sourceProduct.id,
                affiliateTitle: updates.title,
                affiliateDescription: updates.description,
                affiliateSalePrice: updates.original_sale_price,
                affiliateRegularPrice: updates.original_regular_price,
            };

            // 1. AWAIT THE API CALL to add the product
            const response = await fetch('/api/affiliate/add-to-collection', { // Use your correct endpoint
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Failed to claim product.");
            }

            // 2. AWAIT THE REFETCH after the save is successful
            await refetchAffiliateProducts();

            toast.success("Product added to collection!", { id: toastId });

            // 3. CLOSE THE MODAL after everything is done
            onClose();

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsSubmitting(false); // Stop loading state
        }
    };

    return (
        <ProductEditorProvider initialProductData={sourceProduct}>
            {/* The ProductEditor now correctly triggers our async handler */}
            <ProductEditor 
                title="Claim Product"
                saveButtonText={isSubmitting ? "Saving..." : "Drop To Collection"}
                startInEditMode={true}
                onSave={handleSaveProduct}
                onCancel={onClose}
            />
        </ProductEditorProvider>
    );
}