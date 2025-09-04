// src/components/ProductEditor.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useProductEditor } from '@/context/ProductEditorContext';
import { ProductType } from '@/types/product';
import { toast } from 'sonner'; // Import the toast function from sonner

interface ProductEditorProps {
    onSave?: (updates: Partial<ProductType>) => void;
    title?: string;
    saveButtonText?: string;
    startInEditMode?: boolean;
    onCancel?: () => void;
}

export default function ProductEditor({ 
    onSave, 
    title = "Product Details",
    saveButtonText = "Save Changes",
    startInEditMode = false,
    onCancel
}: ProductEditorProps) {
    const { productData, updateProductData } = useProductEditor();
    const [isEditing, setIsEditing] = useState(startInEditMode);

    // State for the draft (editable) values
    const [draftTitle, setDraftTitle] = useState(productData.title);
    const [draftDescription, setDraftDescription] = useState(productData.description);
    const [draftSalePrice, setDraftSalePrice] = useState(productData.original_sale_price);
    const [draftRegularPrice, setDraftRegularPrice] = useState(productData.original_regular_price);

    // Effect to reset the draft state if the productData from context changes
    useEffect(() => {
        setDraftTitle(productData.title);
        setDraftDescription(productData.description);
        setDraftSalePrice(productData.original_sale_price);
        setDraftRegularPrice(productData.original_regular_price);
    }, [productData]);

    const handleSave = () => {
        const newSalePrice = Number(draftSalePrice);
        const newRegularPrice = Number(draftRegularPrice);
        const originalPrice = Number(productData.original_sale_price);

        // --- VALIDATION LOGIC ---
        // 1. Check if the new price is higher than the original price.
        if (newSalePrice <= originalPrice) {
            toast.error("Invalid Price", {
                description: `Your new sale price must be higher than the original price of ${originalPrice.toFixed(2)} ${productData.currency}.`,
                duration: 5000,
            });
            return; // Stop the function execution
        }
        
        // 2. (Optional but recommended) Warn if the sale price is higher than the compare-at price.
        if (newRegularPrice > 0 && newSalePrice > newRegularPrice) {
            toast.warning("Check Your Pricing", {
                description: "The sale price is higher than the 'compare-at' price. This may confuse customers.",
                duration: 6000,
            });
        }
        
        // If validation passes, proceed with saving.
        const updatedFields: Partial<ProductType> = {
            title: draftTitle,
            description: draftDescription,
            original_sale_price: newSalePrice,
            original_regular_price: newRegularPrice,
        };
        
        updateProductData(updatedFields);
        if (onSave) onSave(updatedFields);
        if (!startInEditMode) setIsEditing(false);
        
        toast.success("Claimed successfully!");
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            // Reset fields to original state before toggling edit mode
            setDraftTitle(productData.title);
            setDraftDescription(productData.description);
            setDraftSalePrice(productData.original_sale_price);
            setDraftRegularPrice(productData.original_regular_price);
            setIsEditing(false);
        }
    };
    
    return (
        <div className="w-full max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
             <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                <div>
                    {isEditing ? (
                        <>
                            <button onClick={handleCancel} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Cancel</button>
                            <button onClick={handleSave} className="ml-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">{saveButtonText}</button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900">Edit</button>
                    )}
                </div>
            </div>
            
            <div className="space-y-4">
                {isEditing ? (
                    // ---- EDITING FORM ----
                    <>
                        <div>
                            <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-600">Title</label>
                            <input 
                                id="title"
                                type="text" 
                                value={draftTitle} 
                                onChange={(e) => setDraftTitle(e.target.value)} 
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500" 
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-600">Description</label>
                            <textarea 
                                id="description"
                                value={draftDescription} 
                                onChange={(e) => setDraftDescription(e.target.value)} 
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500" 
                                rows={4} 
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="salePrice" className="mb-1 block text-sm font-medium text-gray-600">Your Sale Price ({productData.currency})</label>
                                <input 
                                    id="salePrice"
                                    type="number" 
                                    value={draftSalePrice} 
                                    onChange={(e) => setDraftSalePrice(Number(e.target.value))} 
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500" 
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Original Price: {productData.original_sale_price.toFixed(2)}
                                </p>
                            </div>
                            <div>
                                <label htmlFor="regularPrice" className="mb-1 block text-sm font-medium text-gray-600">Compare-at Price ({productData.currency})</label>
                                <input 
                                    id="regularPrice"
                                    type="number" 
                                    value={draftRegularPrice} 
                                    onChange={(e) => setDraftRegularPrice(Number(e.target.value))} 
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500" 
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    // ---- DISPLAY VIEW ----
                    <>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Title</h3>
                            <p className="mt-1 text-gray-800">{productData.title}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Description</h3>
                            <p className="mt-1 text-gray-800">{productData.description}</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                             <div>
                                <h3 className="text-sm font-medium text-gray-500">Sale Price</h3>
                                <p className="mt-1 text-lg font-semibold text-gray-900">
                                    {productData.original_sale_price.toFixed(2)} {productData.currency}
                                </p>
                            </div>
                             <div>
                                <h3 className="text-sm font-medium text-gray-500">Compare-at Price</h3>
                                <p className="mt-1 text-lg text-gray-500 line-through">
                                    {productData.original_regular_price.toFixed(2)} {productData.currency}
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}