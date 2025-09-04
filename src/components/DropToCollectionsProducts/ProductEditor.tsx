// src/components/ProductEditor.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useProductEditor } from '@/context/ProductEditorContext';
import { ProductType } from '@/types/product';
import { toast } from 'sonner';

// Consistent input styling, inspired by your UploadProductPage
const InputStyles = `w-full py-2.5 px-3 text-neutral-800 placeholder:text-neutral-400 
bg-white border-b border-neutral-400/80 ring ring-neutral-200 rounded-lg 
shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-purple-400 
transition-all`;

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

        if (newSalePrice <= originalPrice) {
            toast.error("Invalid Price", {
                description: `Your new sale price must be higher than the original price of ${originalPrice.toFixed(2)} ${productData.currency}.`,
                duration: 5000,
            });
            return; 
        }
        
        if (newRegularPrice > 0 && newSalePrice > newRegularPrice) {
            toast.warning("Check Your Pricing", {
                description: "The sale price is higher than the 'compare-at' price. This may confuse customers.",
                duration: 6000,
            });
        }
        
        const updatedFields: Partial<ProductType> = {
            title: draftTitle,
            description: draftDescription,
            original_sale_price: newSalePrice,
            original_regular_price: newRegularPrice,
        };
        
        updateProductData(updatedFields);
        if (onSave) onSave(updatedFields);
        if (!startInEditMode) setIsEditing(false);
        
        toast.success("Changes saved successfully!");
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            setDraftTitle(productData.title);
            setDraftDescription(productData.description);
            setDraftSalePrice(productData.original_sale_price);
            setDraftRegularPrice(productData.original_regular_price);
            setIsEditing(false);
        }
    };
    
    return (
        <div className="w-full max-w-2xl bg-white border-b border-neutral-400/80 ring ring-neutral-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] rounded-lg">
             <header className="py-3 px-6 flex items-center justify-between border-b border-neutral-200">
                <h2 className="text-lg font-semibold text-neutral-800">{title}</h2>
                <div>
                    {isEditing ? (
                        <>
                            <button onClick={handleCancel} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">Cancel</button>
                            <button onClick={handleSave} className="ml-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors">{saveButtonText}</button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 transition-colors">Edit</button>
                    )}
                </div>
            </header>
            
            <div className="p-6">
                {isEditing ? (
                    // ---- EDITING FORM ----
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-semibold text-neutral-700 mb-1.5">Title</label>
                            <input 
                                id="title"
                                type="text" 
                                value={draftTitle} 
                                onChange={(e) => setDraftTitle(e.target.value)} 
                                className={InputStyles}
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-neutral-700 mb-1.5">Description</label>
                            <textarea 
                                id="description"
                                value={draftDescription} 
                                onChange={(e) => setDraftDescription(e.target.value)} 
                                className={InputStyles}
                                rows={4} 
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="salePrice" className="block text-sm font-semibold text-neutral-700 mb-1.5">Your Sale Price</label>
                                <div className="flex items-center border-b border-neutral-400 ring ring-neutral-200 rounded-lg bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] h-11 overflow-hidden">
                                    <span className="bg-neutral-800 text-neutral-200 font-semibold h-full flex justify-center items-center px-4">{productData.currency}</span>
                                    <input 
                                        id="salePrice"
                                        type="number" 
                                        value={draftSalePrice} 
                                        onChange={(e) => setDraftSalePrice(Number(e.target.value))} 
                                        className="w-full px-3 py-2.5 text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
                                    />
                                </div>
                                <p className="mt-1.5 text-xs text-gray-500">
                                    Original Price: {productData.original_sale_price.toFixed(2)}
                                </p>
                            </div>
                            <div>
                                <label htmlFor="regularPrice" className="block text-sm font-semibold text-neutral-700 mb-1.5">Compare-at Price</label>
                                 <div className="flex items-center border-b border-neutral-400 ring ring-neutral-200 rounded-lg bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] h-11 overflow-hidden">
                                    <span className="bg-neutral-800 text-neutral-200 font-semibold h-full flex justify-center items-center px-4">{productData.currency}</span>
                                    <input 
                                        id="regularPrice"
                                        type="number" 
                                        value={draftRegularPrice} 
                                        onChange={(e) => setDraftRegularPrice(Number(e.target.value))} 
                                        className="w-full px-3 py-2.5 text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // ---- DISPLAY VIEW ----
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-semibold text-neutral-700">Title</h3>
                            <p className="mt-1.5 text-neutral-800">{productData.title}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-neutral-700">Description</h3>
                            <p className="mt-1.5 text-neutral-800 leading-relaxed">{productData.description}</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                             <div>
                                <h3 className="text-sm font-semibold text-neutral-700">Your Sale Price</h3>
                                <p className="mt-1.5 text-xl font-bold text-neutral-900">
                                    {productData.original_sale_price.toFixed(2)} {productData.currency}
                                </p>
                            </div>
                             <div>
                                <h3 className="text-sm font-semibold text-neutral-700">Compare-at Price</h3>
                                <p className="mt-1.5 text-lg text-gray-500 line-through">
                                    {productData.original_regular_price.toFixed(2)} {productData.currency}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}