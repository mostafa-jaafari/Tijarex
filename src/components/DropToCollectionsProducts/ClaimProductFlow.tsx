"use client";

import React from 'react';
import { toast } from "sonner";
import { ProductType } from '@/types/product';
import { ProductEditorProvider } from '@/context/ProductEditorContext';
import ProductEditor from './ProductEditor';

interface ClaimProductFlowProps {
    sourceProduct: ProductType;
    onClose: () => void;
}

export default function ClaimProductFlow({ sourceProduct, onClose }: ClaimProductFlowProps) {

    const handleClaimProduct = async (modifiedFields: Partial<ProductType>) => {
        const toastId = toast.loading("Claiming product...");

        // --- UPDATED PAYLOAD ---
        // We now include all the fields the affiliate can modify.
        // We use fallbacks (||) to ensure that if a field isn't changed,
        // the original product's value is used as a default.
        const payload = {
            originalProductId: sourceProduct.id,
            affiliateTitle: modifiedFields.title || sourceProduct.title,
            affiliateDescription: modifiedFields.description || sourceProduct.description,
            affiliateSalePrice: modifiedFields.original_sale_price || sourceProduct.original_sale_price,
            affiliateRegularPrice: modifiedFields.original_regular_price || sourceProduct.original_regular_price,
        };

        try {
            // The API endpoint remains the same.
            const response = await fetch('/api/affiliate/add-to-collection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'API error');
            
            // Use the new title in the success message for better feedback.
            toast.success(`Product "${payload.affiliateTitle}" claimed!`, { id: toastId });
            onClose(); // Close the modal on success

        } catch (error) {
            console.error("Claiming error:", error);
            toast.error(`Error: ${(error as Error).message}`, { id: toastId });
        }
    };

    return (
        <ProductEditorProvider initialProductData={sourceProduct}>
            <ProductEditor 
                onSave={handleClaimProduct}
                onCancel={onClose}
                title="Customize & Claim Product"
                saveButtonText="Confirm & Claim"
                startInEditMode={true} 
            />
        </ProductEditorProvider>
    );
}