"use client";
import { type ProductType } from "@/types/product";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface MyCollectionProductsContextType {
    myCollectionProducts: ProductType[];
    isMyCollectionProductsLoading: boolean;
    refetchMyCollectionProducts: () => void;
};

const MyCollectionProductsContext = createContext<MyCollectionProductsContextType | undefined>(undefined);

export const MyCollectionProductsContextProvider = ({ children }: { children: ReactNode; }) => {
    const [myCollectionProducts, setMyCollectionProducts] = useState<ProductType[]>([]);
    const [isMyCollectionProductsLoading, setIsMyCollectionProductsLoading] = useState(true);
    const { status } = useSession();

    const fetchMyCollectionProducts = useCallback(async () => {
        setIsMyCollectionProductsLoading(true);
        try {
            const response = await fetch('/api/products/mycollectionproducts');
            
            if (!response.ok) {
                if (response.status === 401) {
                    setMyCollectionProducts([]);
                    return;
                }
                throw new Error(`Failed to fetch products. Status: ${response.status}`);
            }
            
            const data = await response.json();
            // --- إصلاح: قراءة البيانات من "products" بدلاً من "collection_products" ---
            setMyCollectionProducts(data.products as ProductType[] || []);
        } catch (error) {
            console.error("Error in fetchMyCollectionProducts:", error);
            setMyCollectionProducts([]);
        } finally {
            setIsMyCollectionProductsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchMyCollectionProducts();
        }
        
        if (status === 'unauthenticated') {
            setMyCollectionProducts([]);
            setIsMyCollectionProductsLoading(false);
        }
    }, [status, fetchMyCollectionProducts]);

    const contextValue = {
        myCollectionProducts,
        isMyCollectionProductsLoading,
        refetchMyCollectionProducts: fetchMyCollectionProducts,
    };

    return (
        <MyCollectionProductsContext.Provider value={contextValue}>
            {children}
        </MyCollectionProductsContext.Provider>
    );
};

export const useMyCollectionProducts = () => {
    const context = useContext(MyCollectionProductsContext);
    if (context === undefined) {
        throw new Error("useMyCollectionProducts must be used within an MyCollectionProductsContextProvider");
    }
    return context;
};