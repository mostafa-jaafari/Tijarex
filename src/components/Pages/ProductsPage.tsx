"use client";

import { Search } from "lucide-react";
import { CustomDropdown } from "../UI/CustomDropdown";
import { toast } from "sonner";
import { ProductCardUI } from "../UI/ProductCardUI";
import { useUserInfos } from "@/context/UserInfosContext";
import { useEffect, useState } from "react";
import { useGlobaleProducts } from "@/context/GlobalProductsContext";
import { PackageSearch } from 'lucide-react'; // A nice icon for the empty state

// Skeleton Component for cleaner code
const ProductCardSkeleton = () => (
    <div>
        <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse" />
        <div className="w-full h-6 bg-gray-200 rounded-md mt-3 animate-pulse" />
        <div className="w-1/2 h-6 bg-gray-200 rounded-md mt-2 animate-pulse" />
        <div className="w-full h-8 bg-gray-200 rounded-md mt-3 animate-pulse" />
    </div>
);

export default function ProductsPage() {
    const { userInfos } = useUserInfos();
    const { globalProductsData, isLoadingGlobalProducts } = useGlobaleProducts();
    
    // --- FIX START ---
    // State to track if this is the component's very first load cycle.
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        // When the global loading state from your hook becomes false,
        // it means the initial data fetch has completed. We can now
        // turn off our local initial load flag.
        if (!isLoadingGlobalProducts) {
            setIsInitialLoad(false);
        }
    }, [isLoadingGlobalProducts]);
    
    // Determine if we should show the loading state. This is true if it's the
    // initial mount OR if a subsequent fetch (e.g., filtering) is in progress.
    const shouldShowLoading = isInitialLoad || isLoadingGlobalProducts;
    // --- FIX END ---
    
    return (
        <section>
            {/* --- Top Header Products Page --- */}
            <div className="w-full flex justify-center">
                <div 
                    className="group bg-white flex gap-3 items-center px-3 
                        grow max-w-[600px] min-w-[400px] border-b 
                        border-gray-400/80 ring ring-neutral-200 
                        rounded-lg shadow-sm">
                    <Search size={20} className="text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search products by name, category..."
                        className="grow rounded-lg outline-none py-2 text-sm"
                    />
                </div>
            </div>

            {/* --- Top Filter DropDowns --- */}
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                    <CustomDropdown
                        options={["All Categories", "Electronics", "Apparel", "Books"]}
                        selectedValue="All Categories"
                        onSelect={(value) => toast.info(value)}
                    />
                    <CustomDropdown
                        options={["All Categories", "Electronics", "Apparel", "Books"]}
                        selectedValue="All Categories"
                        onSelect={(value) => toast.info(value)}
                    />
                    <CustomDropdown
                        options={["All Categories", "Electronics", "Apparel", "Books"]}
                        selectedValue="All Categories"
                        onSelect={(value) => toast.info(value)}
                    />
                    <CustomDropdown
                        options={["All Categories", "Electronics", "Apparel", "Books"]}
                        selectedValue="All Categories"
                        onSelect={(value) => toast.info(value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-nowrap text-sm text-gray-500">Sort by:</p>
                    <CustomDropdown
                        options={["Relevance", "Price: Low to High", "Price: High to Low"]}
                        selectedValue="Relevance"
                        onSelect={(value) => toast.info(value)}
                    />
                </div>
            </div>

            {/* --- Divider --- */}
            <hr className="w-full border-gray-200 my-4"/>

            {/* --- Products Grid --- */}
            <div 
                className="w-full p-6 bg-white rounded-lg border-b 
                    border-gray-400/80 ring ring-neutral-200 grid grid-cols-1 
                    sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {shouldShowLoading ? (
                    // Loading State: Show skeletons
                    Array(8).fill(0).map((_, idx) => (
                        <ProductCardSkeleton key={idx} />
                    ))
                ) : globalProductsData.length > 0 ? (
                    // Data Loaded and Available: Show products
                    globalProductsData.map((product) => (
                        <ProductCardUI
                            key={product.id}
                            isAffiliate={userInfos?.UserRole === "affiliate"}
                            isFavorite={true} // Replace with real data
                            onAddToStore={() => toast.success("Added to store")}
                            onToggleFavorite={() => toast.success("Toggled favorite")}
                            product={product}
                        />
                    ))
                ) : (
                    // Data Loaded but Empty: Show empty state
                    <div className="col-span-full w-full flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-gray-200">
                        <PackageSearch size={48} className="text-gray-400 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800">No Products Found</h2>
                        <p className="text-gray-500 mt-2">Try adjusting your filters or search criteria.</p>
                    </div>
                )}
            </div>
        </section>
    );
}