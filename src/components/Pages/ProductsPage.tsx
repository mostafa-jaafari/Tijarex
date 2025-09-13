"use client";

import { Search, PackageSearch, LayoutDashboard, UploadCloud, Loader2 } from "lucide-react";
import { CustomDropdown } from "../UI/CustomDropdown";
// ✅ FIX: Imports are now separated and correct
import { ConfirmationModal, ProductCardUI } from "../UI/ProductCardUI";
import { useUserInfos } from "@/context/UserInfosContext";
import { useEffect, useState, useMemo } from "react";
import { ProductType } from "@/types/product";
import { AnimatePresence, motion } from "framer-motion";
import ClaimProductFlow from "../DropToCollectionsProducts/ClaimProductFlow";
import Link from "next/link";
import { useAffiliateAvailableProducts } from "@/context/AffiliateAvailableProductsContext";
// ✅ FIX: Toaster component is required to show toasts
import { Toaster, toast } from "sonner";

// Skeleton Component for cleaner code
const ProductCardSkeleton = () => (
    <div>
        <div className="w-full h-52 bg-gray-200 rounded-lg animate-pulse" />
        <div className="w-full h-6 bg-gray-200 rounded-md mt-3 animate-pulse" />
        <div className="w-1/2 h-6 bg-gray-200 rounded-md mt-2 animate-pulse" />
        <div className="w-full h-8 bg-gray-200 rounded-md mt-3 animate-pulse" />
    </div>
);

export default function ProductsPage() {
    const { userInfos } = useUserInfos();
    // ✅ FIX: Destructure all required values from the context
    const {
        affiliateAvailableProductsData: allProducts,
        isLoadingAffiliateAvailableProducts,
        isLoadingMore,
        hasMore,
        fetchMoreProducts,
        refetch
    } = useAffiliateAvailableProducts();

    // --- State for Modals and Actions ---
    const [productToDelete, setProductToDelete] = useState<ProductType | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [productToClaim, setProductToClaim] = useState<ProductType | null>(null);
    
    // --- State for Filtering and Sorting ---
    const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedColor, setSelectedColor] = useState('All Colors');
    const [selectedSize, setSelectedSize] = useState('All Sizes');
    const [selectedPrice, setSelectedPrice] = useState('All Prices');
    const [sortBy, setSortBy] = useState('Relevance');
    
    // --- State for Favorites & UI Loading ---
    const [favoriteProductIds, setFavoriteProductIds] = useState<Set<string>>(new Set());
    const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
    const shouldShowSkeleton = isLoadingAffiliateAvailableProducts && allProducts.length === 0;

    // --- Deletion Logic ---
    const handleInitiateDelete = (product: ProductType) => {
        setProductToDelete(product);
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/products/${productToDelete.id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete product.");
            }
            toast.success(`Product "${productToDelete.title}" was deleted.`);
            // ✅ FIX: refetch() is now called to update the product list
            refetch();
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setIsDeleting(false);
            setProductToDelete(null); // Close the modal
        }
    };

    // --- Favorites Fetching Logic ---
    useEffect(() => {
        if (!userInfos) {
            setFavoriteProductIds(new Set());
            setIsLoadingFavorites(false);
            return;
        }
        const fetchFavorites = async () => {
            setIsLoadingFavorites(true);
            try {
                const response = await fetch('/api/products/favorites');
                if (response.ok) {
                    const data = await response.json();
                    setFavoriteProductIds(new Set<string>(data.products.map((p: ProductType) => p.id)));
                }
            } catch (error) {
                console.error("Failed to fetch favorites:", error);
            } finally {
                setIsLoadingFavorites(false);
            }
        };
        fetchFavorites();
    }, [userInfos]);

    // --- Generate Dynamic Filter Options ---
    const categories = useMemo(() => ['All Categories', ...Array.from(new Set(allProducts.map((p: ProductType) => p.category)))], [allProducts]);
    const colors = useMemo(() => ['All Colors', ...Array.from(new Set(allProducts.flatMap((p: ProductType) => p.colors || [])))], [allProducts]);
    const sizes = useMemo(() => ['All Sizes', ...Array.from(new Set(allProducts.flatMap((p: ProductType) => p.sizes || [])))], [allProducts]);
    const priceOptions = ['All Prices', 'Dh0 - Dh50', 'Dh50 - Dh100', 'Dh100 - Dh200', 'Dh200+'];
    const sortOptions = ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest'];

    // --- Main Filtering and Sorting Logic ---
    useEffect(() => {
        let processedProducts = [...allProducts];

        if (searchTerm) {
            processedProducts = processedProducts.filter(p =>
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (selectedCategory !== 'All Categories') {
            processedProducts = processedProducts.filter(p => p.category === selectedCategory);
        }
        if (selectedColor !== 'All Colors') {
            processedProducts = processedProducts.filter(p => p.colors?.includes(selectedColor));
        }
        if (selectedSize !== 'All Sizes') {
            processedProducts = processedProducts.filter(p => p.sizes?.includes(selectedSize));
        }
        if (selectedPrice !== 'All Prices') {
            processedProducts = processedProducts.filter(p => {
                const price = p.original_sale_price;
                if (selectedPrice === 'Dh0 - Dh50') return price >= 0 && price <= 50;
                if (selectedPrice === 'Dh50 - Dh100') return price > 50 && price <= 100;
                if (selectedPrice === 'Dh100 - Dh200') return price > 100 && price <= 200;
                if (selectedPrice === 'Dh200+') return price > 200;
                return true;
            });
        }
        switch (sortBy) {
            case 'Price: Low to High':
                processedProducts.sort((a, b) => a.original_sale_price - b.original_sale_price);
                break;
            case 'Price: High to Low':
                processedProducts.sort((a, b) => b.original_sale_price - a.original_sale_price);
                break;
            case 'Newest':
                 // ✅ FIX: Robust date sorting to prevent crashes
                 processedProducts.sort((a, b) => new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime());
                 break;
            case 'Relevance':
            default:
                processedProducts.sort((a, b) => (b.sales || 0) - (a.sales || 0));
                break;
        }
        setFilteredProducts(processedProducts);
    }, [searchTerm, selectedCategory, selectedColor, selectedSize, selectedPrice, sortBy, allProducts]);
    
    const handleClaimClick = (product: ProductType) => {
        setProductToClaim(product);
    }
    
    return (
        <section>
            {/* ✅ FIX: Toaster component is necessary for notifications */}
            <Toaster position="top-center" richColors />

            {/* --- Header & Filters --- */}
            <div className="w-full flex justify-center">
                <div className="group bg-white flex gap-3 items-center px-3 grow max-w-[600px] border border-neutral-300 rounded-lg focus-within:ring-2 focus-within:ring-neutral-400 transition-shadow">
                    <Search size={20} className="text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search products by name, category..."
                        className="grow rounded-lg outline-none py-2.5 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-y-4 mt-4">
                <div className="flex items-center gap-3 flex-wrap">
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
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {shouldShowSkeleton ? (
                    Array(8).fill(0).map((_, idx) => <ProductCardSkeleton key={idx} />)
                ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <ProductCardUI
                            key={product.id}
                            product={product}
                            isAffiliate={userInfos?.UserRole === "affiliate"}
                            isFavorite={favoriteProductIds.has(product.id)}
                            onClaimClick={handleClaimClick}
                            // ✅ FIX: Pass the correct function to open the confirmation modal
                            onDeleteClick={handleInitiateDelete}
                        />
                    ))
                ) : (
                    <div className="col-span-full w-full flex flex-col items-center justify-center py-20 bg-gray-50 border border-gray-200 rounded-xl">
                        <PackageSearch size={48} className="mx-auto text-gray-400 mb-4" />
                        <h2 className="text-xl font-bold text-neutral-700">No Products Found</h2>
                        <p className="text-gray-500 mt-2">Try adjusting your filters or search criteria.</p>
                        <div className='mt-6 flex justify-center gap-2 w-full'>
                            <Link
                                className="w-max inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-xs bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                                href={`${userInfos?.UserRole === "seller" ? "/admin/seller" : "/admin/affiliate"}`}
                                prefetch
                            >
                                <LayoutDashboard size={16} /> Back to Dashboard
                            </Link>
                            {userInfos?.UserRole !== "affiliate" && (
                                <Link 
                                    className="w-max inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-neutral-800 text-neutral-100 hover:bg-neutral-900"
                                    href={`${userInfos?.UserRole === "seller" ? "/admin/seller/upload-products" : "/admin/affiliate"}`}
                                    prefetch
                                >
                                    <UploadCloud size={16} /> Upload Products
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ✅ Load More Button for Pagination */}
            <div className="w-full flex justify-center mt-8">
                {hasMore && (
                    <button
                        onClick={fetchMoreProducts}
                        disabled={isLoadingMore}
                        className="px-6 py-2 bg-neutral-800 text-white font-semibold rounded-lg hover:bg-black disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
                    >
                        {isLoadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isLoadingMore ? "Loading..." : "Load More"}
                    </button>
                )}
            </div>

            {/* --- Modals --- */}
            <ConfirmationModal
                isOpen={!!productToDelete}
                onClose={() => setProductToDelete(null)}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
                title="Delete Product"
                description={`Are you sure you want to permanently delete "${productToDelete?.title}"? This action cannot be undone.`}
            />
            
            <AnimatePresence>
                {productToClaim && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
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