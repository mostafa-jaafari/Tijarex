"use client";

import { useUserInfos } from "@/context/UserInfosContext";
import { useEffect, useMemo, useState } from "react";
import { ProductType } from "@/types/product";
import { Toaster, toast } from "sonner";
import { LayoutDashboard, PackageSearch, Search } from "lucide-react";
import { ProductCardUI } from "../UI/ProductCardUI";
import { CustomDropdown } from "../UI/CustomDropdown";
import { ConfirmationModal } from "../UI/ProductCardUI";
import ClaimProductFlow from "../DropToCollectionsProducts/ClaimProductFlow";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

// Skeleton Component for a clean loading state
const ProductCardSkeleton = () => (
    <div>
        <div className="w-full h-52 bg-gray-200 rounded-lg animate-pulse" />
        <div className="w-full h-6 bg-gray-200 rounded-md mt-3 animate-pulse" />
        <div className="w-1/2 h-6 bg-gray-200 rounded-md mt-2 animate-pulse" />
        <div className="w-full h-8 bg-gray-200 rounded-md mt-3 animate-pulse" />
    </div>
);

export default function FavoritesProducts() {
    // The `refetch` function is no longer needed here for the flicker fix, but we keep `userInfos`.
    const { userInfos, isLoadingUserInfos: isLoadingUser } = useUserInfos();

    // The full list of favorite products, fetched once.
    const [favoriteProducts, setFavoriteProducts] = useState<ProductType[]>([]);
    // This loading state is ONLY for the initial page load.
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    
    // States for filtering and sorting.
    const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [sortBy, setSortBy] = useState('Relevance');

    // States for modals.
    const [productToDelete, setProductToDelete] = useState<ProductType | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [productToClaim, setProductToClaim] = useState<ProductType | null>(null);

    // This effect fetches the initial list of favorite products.
    useEffect(() => {
        if (!userInfos) {
            setFavoriteProducts([]);
            setIsInitialLoading(false);
            return;
        }

        const fetchFullFavoriteProducts = async () => {
            setIsInitialLoading(true);
            try {
                const response = await fetch('/api/products/favorites');
                if (response.ok) {
                    const data = await response.json();
                    setFavoriteProducts(data.products || []);
                } else {
                    toast.error("Could not load your favorite products.");
                }
            } catch (error) {
                console.error("Failed to fetch favorite products:", error);
                toast.error("An error occurred while fetching favorites.");
            } finally {
                setIsInitialLoading(false);
            }
        };

        fetchFullFavoriteProducts();
    }, [userInfos]);

    // Filtering and Sorting Logic.
    const categories = useMemo(() => ['All Categories', ...Array.from(new Set(favoriteProducts.map(p => p.category)))], [favoriteProducts]);
    const sortOptions = ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest'];

    useEffect(() => {
        let processedProducts = [...favoriteProducts];

        if (searchTerm) {
            processedProducts = processedProducts.filter(p =>
                p.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (selectedCategory !== 'All Categories') {
            processedProducts = processedProducts.filter(p => p.category === selectedCategory);
        }
        
        switch (sortBy) {
            case 'Price: Low to High':
                processedProducts.sort((a, b) => a.original_sale_price - b.original_sale_price);
                break;
            case 'Price: High to Low':
                processedProducts.sort((a, b) => b.original_sale_price - a.original_sale_price);
                break;
            case 'Newest':
                 processedProducts.sort((a, b) => new Date(b.createdAt.toDate()).getTime() - new Date(a.createdAt.toDate()).getTime());
                 break;
            default:
                processedProducts.sort((a, b) => (b.sales || 0) - (a.sales || 0));
                break;
        }
        setFilteredProducts(processedProducts);
    }, [searchTerm, selectedCategory, sortBy, favoriteProducts]);
    
    // --- Handlers for Modals and Actions ---

    // ✅ This is the key function to prevent flicker. It removes the product
    // from the local state instantly, without a refetch.
    const handleOptimisticUnfavorite = (unfavoritedProductId: string) => {
        setFavoriteProducts(prevProducts =>
            prevProducts.filter(p => p.id !== unfavoritedProductId)
        );
    };

    const handleInitiateDelete = (product: ProductType) => setProductToDelete(product);
    const handleClaimClick = (product: ProductType) => setProductToClaim(product);
    const handleConfirmDelete = async () => {
        if (!productToDelete) return;
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/products/${productToDelete.id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error("Failed to delete product.");
            toast.success(`Product "${productToDelete.title}" was deleted.`);
            // After deleting, we must also remove it from the favorites list.
            handleOptimisticUnfavorite(productToDelete.id);
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setIsDeleting(false);
            setProductToDelete(null);
        }
    };

    const shouldShowSkeleton = isLoadingUser || isInitialLoading;

    return (
        <section>
            <Toaster position="top-center" richColors />
            
            <div className="space-y-4">
                <h1 className="text-2xl font-bold text-neutral-800">My Favorites</h1>
                <div className="w-full flex justify-center">
                    <div className="group bg-white flex gap-3 items-center px-3 grow max-w-[600px] border border-neutral-300 rounded-lg focus-within:ring-2 focus-within:ring-neutral-400 transition-shadow">
                        <Search size={20} className="text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search in your favorites..."
                            className="grow rounded-lg outline-none py-2.5 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-y-4">
                    <div className="flex items-center gap-3 flex-wrap">
                        <CustomDropdown options={categories} selectedValue={selectedCategory} onSelect={setSelectedCategory} />
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-nowrap text-sm text-gray-500">Sort by:</p>
                        <CustomDropdown options={sortOptions} selectedValue={sortBy} onSelect={setSortBy} />
                    </div>
                </div>
                <hr className="w-full border-gray-200"/>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {shouldShowSkeleton ? (
                    Array(8).fill(0).map((_, idx) => <ProductCardSkeleton key={idx} />)
                ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <ProductCardUI
                            key={product.id}
                            product={product}
                            isAffiliate={userInfos?.UserRole === "affiliate"}
                            onClaimClick={handleClaimClick}
                            onDeleteClick={handleInitiateDelete}
                            // Pass the optimistic update handler to the card.
                            onUnfavorite={handleOptimisticUnfavorite}
                        />
                    ))
                ) : (
                    <div className="col-span-full w-full flex flex-col items-center justify-center py-20 bg-gray-50 border border-gray-200 rounded-xl">
                        <PackageSearch size={48} className="mx-auto text-gray-400 mb-4" />
                        <h2 className="text-xl font-bold text-neutral-700">No Favorites Yet</h2>
                        <p className="text-gray-500 mt-2">Click the heart icon on a product to save it here.</p>
                        <Link
                            className="mt-6 w-max inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-xs bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                            href="/products"
                        >
                            <LayoutDashboard size={16} /> Discover Products
                        </Link>
                    </div>
                )}
            </div>
            
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