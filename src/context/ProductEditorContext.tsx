// src/context/ProductEditorContext.tsx
"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ProductType } from '@/types/product'; // Make sure this path is correct

interface ProductEditorContextValue {
    productData: ProductType;
    updateProductData: (updates: Partial<ProductType>) => void;
}

const ProductEditorContext = createContext<ProductEditorContextValue | undefined>(undefined);

export const useProductEditor = () => {
    const context = useContext(ProductEditorContext);
    if (!context) {
        throw new Error('useProductEditor must be used inside a ProductEditorProvider');
    }
    return context;
};

export const ProductEditorProvider = ({ children, initialProductData }: { children: ReactNode, initialProductData: ProductType }) => {
    const [productData, setProductData] = useState<ProductType>(initialProductData);

    const updateProductData = (updates: Partial<ProductType>) => {
        setProductData(prevData => ({ ...prevData, ...updates }));
    };

    const value: ProductEditorContextValue = {
        productData,
        updateProductData,
    };

    return (
        <ProductEditorContext.Provider value={value}>
            {children}
        </ProductEditorContext.Provider>
    );
};