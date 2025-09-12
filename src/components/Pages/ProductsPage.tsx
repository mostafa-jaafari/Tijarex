"use client";

import { Search, PackageSearch, LayoutDashboard, UploadCloud } from "lucide-react";
import { CustomDropdown } from "../UI/CustomDropdown";
import { ProductCardUI } from "../UI/ProductCardUI";
import { useUserInfos } from "@/context/UserInfosContext";
import { useEffect, useState, useMemo } from "react";
import { useGlobalProducts } from "@/context/GlobalProductsContext";
// --- Import both types to handle the function signature ---
import { ProductType, AffiliateProductType } from "@/types/product";
import { AnimatePresence, motion } from "framer-motion";
import ClaimProductFlow from "../DropToCollectionsProducts/ClaimProductFlow";
import Link from "next/link";
import { Timestamp } from "firebase-admin/firestore";

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
    const { globalProductsData, isLoadingGlobalProducts } = useGlobalProducts();

    // --- State Management ---
    const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
    const [productToClaim, setProductToClaim] = useState<ProductType | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedColor, setSelectedColor] = useState('All Colors');
    const [selectedSize, setSelectedSize] = useState('All Sizes');
    const [selectedPrice, setSelectedPrice] = useState('All Prices');
    const [sortBy, setSortBy] = useState('Relevance');
    
    const [favoriteProductIds, setFavoriteProductIds] = useState<Set<string>>(new Set());
    const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

    const [isInitialLoad, setIsInitialLoad] = useState(true);
    useEffect(() => {
        if (!isLoadingGlobalProducts) {
            setIsInitialLoad(false);
        }
    }, [isLoadingGlobalProducts]);

    // Fetch user's favorite product IDs on component mount
    useEffect(() => {
        if (userInfos) {
            const fetchFavorites = async () => {
                setIsLoadingFavorites(true);
                try {
                    const response = await fetch('/api/products/favorites');
                    if (response.ok) {
                        const data = await response.json();
                        const ids = new Set<string>(data.products.map((p: ProductType) => p.id));
                        setFavoriteProductIds(ids);
                    }
                } catch (error) {
                    console.error("Failed to fetch favorites:", error);
                } finally {
                    setIsLoadingFavorites(false);
                }
            };
            fetchFavorites();
        } else {
            setFavoriteProductIds(new Set());
            setIsLoadingFavorites(false);
        }
    }, [userInfos]);

    const shouldShowLoading = isInitialLoad || isLoadingGlobalProducts || isLoadingFavorites;

    // --- Generate Dynamic Filter Options ---
    const categories = useMemo(() => {
        if (!globalProductsData) return ['All Categories'];
        const uniqueCategories = new Set(globalProductsData.map(p => p.category));
        return ['All Categories', ...Array.from(uniqueCategories)];
    }, [globalProductsData]);

    const colors = useMemo(() => {
        if (!globalProductsData) return ['All Colors'];
        const allColors = globalProductsData.flatMap(p => p.colors || []);
        const uniqueColors = new Set(allColors);
        return ['All Colors', ...Array.from(uniqueColors)];
    }, [globalProductsData]);

    const sizes = useMemo(() => {
        if (!globalProductsData) return ['All Sizes'];
        const allSizes = globalProductsData.flatMap(p => p.sizes || []);
        const uniqueSizes = new Set(allSizes);
        return ['All Sizes', ...Array.from(uniqueSizes)];
    }, [globalProductsData]);

    const priceOptions = ['All Prices', 'Dh0 - Dh50', 'Dh50 - Dh100', 'Dh100 - Dh200', 'Dh200+'];
    const sortOptions = ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest'];

    // --- Main Filtering and Sorting Logic ---
    useEffect(() => {
        if (!globalProductsData) return;
        let products = [...globalProductsData];

        if (searchTerm) {
            products = products.filter(p =>
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (selectedCategory !== 'All Categories') {
            products = products.filter(p => p.category === selectedCategory);
        }
        if (selectedColor !== 'All Colors') {
            products = products.filter(p => p.colors?.includes(selectedColor));
        }
        if (selectedSize !== 'All Sizes') {
            products = products.filter(p => p.sizes?.includes(selectedSize));
        }
        if (selectedPrice !== 'All Prices') {
            products = products.filter(p => {
                const price = p.originalPrice;
                if (selectedPrice === 'Dh0 - Dh50') return price >= 0 && price <= 50;
                if (selectedPrice === 'Dh50 - Dh100') return price > 50 && price <= 100;
                if (selectedPrice === 'Dh100 - Dh200') return price > 100 && price <= 200;
                if (selectedPrice === 'Dh200+') return price > 200;
                return true;
            });
        }
        switch (sortBy) {
            case 'Price: Low to High':
                products.sort((a, b) => a.originalPrice - b.originalPrice);
                break;
            case 'Price: High to Low':
                products.sort((a, b) => b.originalPrice - a.originalPrice);
                break;
            case 'Newest':
                 products.sort((a, b) => {
                     const aDate = (a.createdAt as Timestamp).toDate();
                     const bDate = (b.createdAt as Timestamp).toDate();
                     return bDate.getTime() - aDate.getTime();
                 });
                 break;
            case 'Relevance':
            default:
                products.sort((a, b) => b.totalSales - a.totalSales);
                break;
        }

        setFilteredProducts(products);

    }, [searchTerm, selectedCategory, selectedColor, selectedSize, selectedPrice, sortBy, globalProductsData]);
    
    // --- ⭐️ FIX IS HERE ⭐️ ---
    // The function now accepts the union type to match the prop in ProductCardUI.
    const handleClaimClick = (product: ProductType | AffiliateProductType) => {
        // We use a "type guard" to check if the product has a property that only
        // exists on ProductType. This assures TypeScript that we are handling the type safely.
        if ('listingType' in product) {
            setProductToClaim(product as ProductType);
        } else {
            // This case shouldn't happen on this page, but it's good practice to handle it.
            console.error("Cannot claim this product type from the marketplace.", product);
        }
    }
    
    return (
        <section>
            {/* --- Header & Filters --- */}
            <div className="w-full flex justify-center">
                <div 
                    className="group bg-white flex gap-3 items-center 
                        px-3 grow max-w-[600px] min-w-[400px] border-b 
                        border-neutral-400 ring ring-neutral-200 
                        rounded-lg focus-within:ring-neutral-300"
                >
                    <Search size={20} className="text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search products by name, category..."
                        className="grow rounded-lg outline-none focus:py-3 transition-all duration-300 py-2.5 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                    <CustomDropdown options={categories} selectedValue={selectedCategory} onSelect={setSelectedCategory} />
                    <CustomDropdown options={colors} selectedValue={selectedColor} onSelect={setSelectedColor} />
                    <CustomDropdown options={sizes} selectedValue={selectedSize} onSelect={setSelectedSize} />
                    <CustomDropdown options={priceOptions} selectedValue={selectedPrice} onSelect={setSelectedPrice} />
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-nowrap text-sm text-gray-500">Sort by:</p>
                    <CustomDropdown options={sortOptions} selectedValue={sortBy} onSelect={setSortBy} />
                </div>
            </div>
            <hr className="w-full border-gray-200 my-4"/>

            {/* --- Products Grid --- */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {shouldShowLoading ? (
                    Array(8).fill(0).map((_, idx) => <ProductCardSkeleton key={idx} />)
                ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => {
                        const isProductFavorite = favoriteProductIds.has(product.id);

                        return (
                            <ProductCardUI
                                key={product.id}
                                product={product}
                                isAffiliate={userInfos?.UserRole === "affiliate"}
                                isFavorite={isProductFavorite}
                                // Now the handleClaimClick function perfectly matches the expected prop type
                                onClaimClick={handleClaimClick}
                            />
                        );
                    })
                ) : (
                    <div 
                        className="col-span-full w-full flex flex-col 
                            items-center justify-center py-20
                            bg-white border-b border-neutral-400 ring
                            ring-neutral-200 rounded-xl">
                        <PackageSearch 
                            size={48} 
                            className="mx-auto text-gray-400 mb-4"
                        />
                        <h2 className="text-xl font-bold text-neutral-700">No Products Found</h2>
                        <p className="text-gray-500 mt-2">Try adjusting your filters or search criteria.</p>
                        <div
                            className='mt-6 flex justify-center gap-2 w-full'
                        >
                            <Link
                                className={`w-max inline-flex items-center 
                                    gap-2 px-3 py-1.5 rounded-lg font-semibold 
                                    text-xs bg-white border-b border-neutral-400 
                                    text-neutral-700 ring ring-neutral-200
                                    hover:bg-neutral-50`}
                                    href={`${userInfos?.UserRole === "seller" ? "/admin/seller" : "/admin/affiliate"}`}
                                    prefetch
                            >
                                <LayoutDashboard size={16} />
                                Back to Dashboard
                            </Link>
                            {userInfos?.UserRole === "seller" && (
                                <Link 
                                    className={`w-max inline-flex items-center 
                                        gap-2 px-3 py-1.5 rounded-lg 
                                        text-xs bg-neutral-700 border-b border-neutral-800 
                                        text-neutral-100 ring ring-neutral-700
                                        hover:bg-neutral-700/90`}
                                    href="/admin/seller/upload-products"
                                    prefetch
                                >
                                    <UploadCloud size={16} />
                                    Upload Products
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            {/* --- Claim Flow Modal --- */}
            <AnimatePresence>
                {productToClaim && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
                        onClick={() => setProductToClaim(null)}
                    >
                        <div onClick={(e) => e.stopPropagation()}>
                            <ClaimProductFlow 
                                sourceProduct={productToClaim}
                                onClose={() => setProductToClaim(null)}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}