// src/components/DropToCollectionsProducts/ClaimProductFlow.tsx
"use client";

import { useState } from 'react';
import { ProductType } from '@/types/product';
import ProductEditor from './ProductEditor';
import { ProductEditorProvider } from '@/context/ProductEditorContext';
import { useAffiliateProducts } from '@/context/AffiliateProductsContext';
import { toast } from 'sonner';

interface ClaimProductFlowProps {
    sourceProduct: ProductType; // The source is always an original ProductType
    onClose: () => void;
}

export default function ClaimProductFlow({ sourceProduct, onClose }: ClaimProductFlowProps) {
    const { refetchAffiliateProducts } = useAffiliateProducts();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSaveProduct = async (updates: Partial<ProductType & { affiliatePrice: number }>) => {
        setIsSubmitting(true);
        const toastId = toast.loading("Adding product to your collection...");

        try {
            // REVISED PAYLOAD: Send only the necessary data to the new API endpoint.
            const payload = {
                originalProductId: sourceProduct.id,
                affiliateTitle: updates.title,
                affiliateDescription: updates.description,
                affiliatePrice: updates.affiliatePrice, // Using the new field from the editor
            };

            const response = await fetch('/api/affiliates/add-to-collection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Failed to claim product.");
            }

            await refetchAffiliateProducts();
            toast.success("Product added to collection!", { id: toastId });
            onClose();

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Pass the original product data to the editor provider
    return (
        <ProductEditorProvider initialProductData={sourceProduct}>
            <ProductEditor 
                title="Claim Product for Your Collection"
                saveButtonText={isSubmitting ? "Saving..." : "Add To My Collection"}
                startInEditMode={true}
                onSave={handleSaveProduct} // Cast to any to avoid complex type issues with onSave
                onCancel={onClose}
                isAffiliateClaiming={true} // IMPORTANT: Tell the editor to show the affiliate price field
            />
        </ProductEditorProvider>
    );
}