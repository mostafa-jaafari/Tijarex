"use client";

import { Search, PackageSearch } from "lucide-react";
import { CustomDropdown } from "../UI/CustomDropdown";
import { toast } from "sonner";
import { ProductCardUI } from "../UI/ProductCardUI";
import { useUserInfos } from "@/context/UserInfosContext";
import { useEffect, useState, useMemo } from "react";
import { useGlobalProducts } from "@/context/GlobalProductsContext";
import { ProductType } from "@/types/product";
import { AnimatePresence, motion } from "framer-motion";
import ClaimProductFlow from "../DropToCollectionsProducts/ClaimProductFlow";
import { useAffiliateProducts } from "@/context/AffiliateProductsContext";

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
    const { affiliateProducts, isAffiliateProductsLoading } = useAffiliateProducts();

    // State for the currently displayed products
    const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
    const [productToClaim, setProductToClaim] = useState<ProductType | null>(null);
    // States for filter controls
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedColor, setSelectedColor] = useState('All Colors');
    const [selectedSize, setSelectedSize] = useState('All Sizes');
    const [selectedPrice, setSelectedPrice] = useState('All Prices');
    const [sortBy, setSortBy] = useState('Relevance');
    
    // --- Initial Load Handling ---
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    useEffect(() => {
        if (!isAffiliateProductsLoading) {
            setIsInitialLoad(false);
        }
    }, [isAffiliateProductsLoading]);
    const shouldShowLoading = isInitialLoad || isAffiliateProductsLoading;

    // --- Generate Dynamic Filter Options ---
    // Using useMemo to prevent recalculating these on every render
    const categories = useMemo(() => {
        if (!affiliateProducts) return ['All Categories'];
        const uniqueCategories = new Set(affiliateProducts.map(p => p.category));
        return ['All Categories', ...Array.from(uniqueCategories)];
    }, [affiliateProducts]);

    const colors = useMemo(() => {
        if (!affiliateProducts) return ['All Colors'];
        const allColors = affiliateProducts.flatMap(p => p.colors || []);
        const uniqueColors = new Set(allColors);
        return ['All Colors', ...Array.from(uniqueColors)];
    }, [affiliateProducts]);

    const sizes = useMemo(() => {
        if (!affiliateProducts) return ['All Sizes'];
        const allSizes = affiliateProducts.flatMap(p => p.sizes || []);
        const uniqueSizes = new Set(allSizes);
        return ['All Sizes', ...Array.from(uniqueSizes)];
    }, [affiliateProducts]);

    const priceOptions = ['All Prices', 'Dh0 - Dh50', 'Dh50 - Dh100', 'Dh100 - Dh200', 'Dh200+'];
    const sortOptions = ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest'];


    // --- Main Filtering and Sorting Logic ---
    useEffect(() => {
        let products = [...affiliateProducts];

        // 1. Search Filter (by title or category)
        if (searchTerm) {
            products = products.filter(p =>
                p.AffiliateTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 2. Category Filter
        if (selectedCategory !== 'All Categories') {
            products = products.filter(p => p.category === selectedCategory);
        }

        // 3. Color Filter
        if (selectedColor !== 'All Colors') {
            products = products.filter(p => p.colors && p.colors.includes(selectedColor));
        }

        // 4. Size Filter
        if (selectedSize !== 'All Sizes') {
            products = products.filter(p => p.sizes && p.sizes.includes(selectedSize));
        }
        
        // 5. Price Filter
        if (selectedPrice !== 'All Prices') {
            products = products.filter(p => {
                const price = p.AffiliateSalePrice;
                if (selectedPrice === 'Dh0 - Dh50') return price >= 0 && price <= 50;
                if (selectedPrice === 'Dh50 - Dh100') return price > 50 && price <= 100;
                if (selectedPrice === 'Dh100 - Dh200') return price > 100 && price <= 200;
                if (selectedPrice === 'Dh200+') return price > 200;
                return true;
            });
        }

        // 6. Sorting Logic
        switch (sortBy) {
            case 'Price: Low to High':
                products.sort((a, b) => a.AffiliateSalePrice - b.AffiliateSalePrice);
                break;
            case 'Price: High to Low':
                products.sort((a, b) => b.AffiliateSalePrice - a.AffiliateSalePrice);
                break;
            case 'Newest':
                 products.sort((a, b) => new Date(b.AffiliateCreatedAt).getTime() - new Date(a.AffiliateCreatedAt).getTime());
                 break;
            case 'Relevance':
            default:
                // Example: sort by number of sales. You can change this logic.
                products.sort((a, b) => (b.sales || 0) - (a.sales || 0));
                break;
        }

        setFilteredProducts(products);

    }, [searchTerm, selectedCategory, selectedColor, selectedSize, selectedPrice, sortBy, affiliateProducts]);
    
    return (
        <section>
          Hi : {affiliateProducts.length}
            {/* --- Top Header Products Page --- */}
            <div className="w-full flex justify-center">
                <div 
                    className="group bg-white flex gap-3 items-center px-3 
                        grow max-w-[600px] min-w-[400px]
                        border-b border-neutral-400 ring ring-neutral-200 
                        shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)]
                        rounded-lg 
                        focus-within:ring-neutral-300">
                    <Search size={20} className="text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search products by name, category..."
                        className="grow rounded-lg outline-none focus:py-3 
                            transition-all duration-300 py-2.5 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* --- Top Filter DropDowns --- */}
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                    <CustomDropdown
                        options={categories}
                        selectedValue={selectedCategory}
                        onSelect={setSelectedCategory}
                    />
                    <CustomDropdown
                        options={colors}
                        selectedValue={selectedColor}
                        onSelect={setSelectedColor}
                    />
                    <CustomDropdown
                        options={sizes}
                        selectedValue={selectedSize}
                        onSelect={setSelectedSize}
                    />
                     <CustomDropdown
                        options={priceOptions}
                        selectedValue={selectedPrice}
                        onSelect={setSelectedPrice}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-nowrap text-sm text-gray-500">Sort by:</p>
                    <CustomDropdown
                        options={sortOptions}
                        selectedValue={sortBy}
                        onSelect={setSortBy}
                    />
                </div>
            </div>

            {/* --- Divider --- */}
            <hr className="w-full border-gray-200 my-4"/>

            {/* --- Products Grid --- */}
            <div 
                className="w-full grid grid-cols-1 sm:grid-cols-2 
                    md:grid-cols-3 lg:grid-cols-4 gap-3"
            >
                {shouldShowLoading ? (
                    // Loading State
                    Array(8).fill(0).map((_, idx) => <ProductCardSkeleton key={idx} />)
                ) : filteredProducts.length > 0 ? (
                    // Data Loaded and Available
                    filteredProducts.map((product) => (
                        <ProductCardUI
                            key={product.id}
                            isAffiliate={userInfos?.UserRole === "affiliate"}
                            isFavorite={true} // Replace with real data
                            onToggleFavorite={() => toast.success("Toggled favorite")}
                            product={product}
                            onClaimClick={setProductToClaim}
                        />
                    ))
                ) : (
                    // Data Loaded but Empty
                    <div className="col-span-full w-full flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-gray-200">
                        <PackageSearch size={48} className="text-gray-400 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800">No Products Found</h2>
                        <p className="text-gray-500 mt-2">Try adjusting your filters or search criteria.</p>
                    </div>
                )}
            </div>
            {/* This section will render our claim flow in an overlay when a product is selected */}
            <AnimatePresence>
                {productToClaim && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
                        onClick={() => setProductToClaim(null)} // Close on backdrop click
                    >
                        <div onClick={(e) => e.stopPropagation()}> {/* Prevent modal from closing when clicking inside it */}
                            <ClaimProductFlow 
                                sourceProduct={productToClaim}
                                onClose={() => setProductToClaim(null)} // Pass the close function
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}