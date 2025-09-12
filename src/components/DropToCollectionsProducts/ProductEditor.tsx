// src/components/ProductEditor.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useProductEditor } from '@/context/ProductEditorContext';
import { ProductType } from '@/types/product';
import { toast } from 'sonner';

const InputStyles = `w-full py-2.5 px-3 text-neutral-800 placeholder:text-neutral-400 
bg-white border-b border-neutral-400/80 ring ring-neutral-200 rounded-lg 
shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-purple-400 
transition-all`;

interface ProductEditorProps {
    onSave?: (updates: Partial<ProductType & { affiliatePrice: number }>) => void;
    title?: string;
    saveButtonText?: string;
    startInEditMode?: boolean;
    onCancel?: () => void;
    isAffiliateClaiming?: boolean; // NEW PROP
}

export default function ProductEditor({
    onSave, 
    title = "Product Details",
    saveButtonText = "Save Changes",
    startInEditMode = false,
    onCancel,
    isAffiliateClaiming = false
}: ProductEditorProps) {
    const { productData } = useProductEditor();
    
    // Draft state for editable fields
    const [draftTitle, setDraftTitle] = useState(productData.title);
    const [draftDescription, setDraftDescription] = useState(productData.description);
    // NEW: state for the affiliate's price
    const [draftAffiliatePrice, setDraftAffiliatePrice] = useState(productData.originalPrice + 10); // Default to 10 more

    useEffect(() => {
        setDraftTitle(productData.title);
        setDraftDescription(productData.description);
        setDraftAffiliatePrice(productData.originalPrice + 10); // Reset when product changes
    }, [productData]);

    const handleSave = () => {
        if (isAffiliateClaiming) {
            const newAffiliatePrice = Number(draftAffiliatePrice);
            const originalPrice = Number(productData.originalPrice);

            if (newAffiliatePrice <= originalPrice) {
                toast.error("Invalid Price", {
                    description: `Your new sale price must be higher than the original price of ${originalPrice.toFixed(2)} ${productData.currency}.`,
                });
                return; 
            }
        }
        
        const updatedFields: Partial<ProductType & { affiliatePrice: number }> = {
            title: draftTitle,
            description: draftDescription,
            // Only include affiliatePrice if we are in that mode
            ...(isAffiliateClaiming && { affiliatePrice: Number(draftAffiliatePrice) }),
        };
        
        if (onSave) {
            onSave(updatedFields);
        }
    };
    
    return (
        <div className="w-full max-w-2xl bg-white border-b border-neutral-400/80 ring ring-neutral-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] rounded-lg">
             <header className="py-3 px-6 flex items-center justify-between border-b border-neutral-200">
                <h2 className="text-lg font-semibold text-neutral-800">{title}</h2>
                <div>
                    <button onClick={onCancel} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="ml-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors">{saveButtonText}</button>
                </div>
            </header>
            
            <div className="p-6">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-neutral-700 mb-1.5">Title</label>
                        <input id="title" type="text" value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} className={InputStyles} />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold text-neutral-700 mb-1.5">Description</label>
                        <textarea id="description" value={draftDescription} onChange={(e) => setDraftDescription(e.target.value)} className={InputStyles} rows={4} />
                    </div>
                    
                    {/* REVISED LOGIC: Conditionally show the affiliate price field */}
                    {isAffiliateClaiming && (
                         <div>
                            <label htmlFor="affiliatePrice" className="block text-sm font-semibold text-neutral-700 mb-1.5">Your Sale Price</label>
                            <div className="flex items-center border-b border-neutral-400 ring ring-neutral-200 rounded-lg bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] h-11 overflow-hidden">
                                <span className="bg-neutral-800 text-neutral-200 font-semibold h-full flex justify-center items-center px-4">{productData.currency}</span>
                                <input 
                                    id="affiliatePrice"
                                    type="number" 
                                    value={draftAffiliatePrice} 
                                    onChange={(e) => setDraftAffiliatePrice(Number(e.target.value))} 
                                    className="w-full px-3 py-2.5 text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
                                />
                            </div>
                            <p className="mt-1.5 text-xs text-gray-500">
                                Original Price: {productData.originalPrice.toFixed(2)}. Your commission will be the difference.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}