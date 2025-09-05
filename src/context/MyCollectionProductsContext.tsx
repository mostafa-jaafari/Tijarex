"use client";
import { type ProductType } from "@/types/product";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
// --- STEP 1: Import the useSession hook ---
import { useSession } from "next-auth/react";

// 1. Define the context's shape (no changes needed here)
interface MyCollectionProductsContextType {
    myCollectionProducts: ProductType[];
    isMyCollectionProductsLoading: boolean;
    refetchMyCollectionProducts: () => void;
};

// 2. Create the context (no changes needed here)
const MyCollectionProductsContext = createContext<MyCollectionProductsContextType | undefined>(undefined);

// 3. Create the Provider Component
export const MyCollectionProductsContextProvider = ({ children }: { children: ReactNode; }) => {
    const [myCollectionProducts, setMyCollectionProducts] = useState<ProductType[]>([]);
    const [isMyCollectionProductsLoading, setIsMyCollectionProductsLoading] = useState(true);

    // --- STEP 2: Get the user's session status ---
    // `status` will be 'loading', 'authenticated', or 'unauthenticated'.
    const { status } = useSession();

    // `useCallback` memoizes the function
    const fetchMyCollectionProducts = useCallback(async () => {
        setIsMyCollectionProductsLoading(true);
        try {
            const response = await fetch('/api/products/mycollectionproducts');
            
            if (!response.ok) {
                // If the response is 401 Unauthorized, we can log it but we won't show an error toast
                // because it's an expected state for a logged-out user.
                if (response.status === 401) {
                    console.log("User not authenticated. Skipping My Collection product fetch.");
                    setMyCollectionProducts([]); // Ensure data is cleared
                    return; // Exit the function early
                }
                throw new Error(`Failed to fetch products. Status: ${response.status}`);
            }
            
            const data = await response.json();
            setMyCollectionProducts(data.collection_products as ProductType[] || []);
        } catch (error) {
            console.error("Error in fetchMyCollectionProducts:", error);
            setMyCollectionProducts([]);
        } finally {
            setIsMyCollectionProductsLoading(false);
        }
    }, []);

    // --- STEP 3: Make the useEffect hook smarter ---
    // This hook now decides WHEN to call the fetch function.
    useEffect(() => {
        // We only want to fetch data if the user is definitively logged in.
        if (status === 'authenticated') {
            fetchMyCollectionProducts();
        }
        
        // If the user is definitively logged out, we don't fetch.
        // We just clear the data and stop the loading spinner.
        if (status === 'unauthenticated') {
            setMyCollectionProducts([]);
            setIsMyCollectionProductsLoading(false);
        }
        
        // If the status is 'loading', we do nothing and wait for the status to resolve.
    }, [status, fetchMyCollectionProducts]); // This effect now runs whenever the auth status changes

    // Create the value object to pass to the provider (no changes needed here)
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

// 4. Create the custom hook (no changes needed here)
export const useMyCollectionProducts = () => {
    const context = useContext(MyCollectionProductsContext);
    if (context === undefined) {
        throw new Error("useMyCollectionProducts must be used within an MyCollectionProductsContextProvider");
    }
    return context;
};