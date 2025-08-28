"use client";

import { ProductType } from "@/types/product";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";


interface GlobalProductsContextTypes {
    globalProductsData: ProductType[] | [];
    isLoadingGlobalProducts: boolean;
    refetch: () => void;
}
const GlobalProductsContext = createContext<GlobalProductsContextTypes | undefined>(undefined);


export const GlobalProductsProvider = ({ children }: { children: ReactNode;}) => {
    const [globalProductsData, setGlobalProductsData] = useState<ProductType[] | []>([]);
    const [isLoadingGlobalProducts, setIsLoadingGlobalProducts] = useState(false);
    
        const { data: session, status } = useSession();
    
        const fetchGlobalProducts = useCallback(async () => {

            if (status !== "authenticated") {
                return;
            }
            
            setIsLoadingGlobalProducts(true);
            try{
                const res = await fetch('/api/products');
                if(!res.ok) {
                    setGlobalProductsData([]);
                    throw new Error("Failed to fetch Products data!");
                }
                const data = await res.json();
                setGlobalProductsData(data.products as ProductType[] || []);
            } catch(error){
                console.error("Error in fetchGlobalProducts:", error);
                setGlobalProductsData([]); 
            } finally {
                setIsLoadingGlobalProducts(false);
            }
        }, [status]); // The function is recreated only when 'status' changes.
        
        // --- FIX 4: The main useEffect now depends on 'status' and the memoized function ---
        useEffect(() => {
            if (status === "authenticated") {
                fetchGlobalProducts();
            } else {
                setGlobalProductsData([]);
                setIsLoadingGlobalProducts(status === "loading");
            }
        }, [status, fetchGlobalProducts]);
    
    
        // The value provided by the context now includes the 'refetch' function.
        const contextValue = { 
            globalProductsData, 
            isLoadingGlobalProducts, 
            refetch: fetchGlobalProducts,
        };
    
        if (!session && status !== "loading") {
            return <>{children}</>;
        }
    return (
        <GlobalProductsContext.Provider value={contextValue}>
            {children}
        </GlobalProductsContext.Provider>
    )
}

export function useGlobaleProducts(){
    const context = useContext(GlobalProductsContext);
    if(!context){
        throw new Error("useGlobalProducts must be used within a GlobalProductsProvider");
    }
    return context;
}