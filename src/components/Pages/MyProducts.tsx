"use client";

import { Search, PackageSearch, LayoutDashboard, UploadCloud } from "lucide-react";
import { CustomDropdown } from "../UI/CustomDropdown";
import { ProductCardUI } from "../UI/ProductCardUI";
import { useUserInfos } from "@/context/UserInfosContext";
import { useEffect, useState, useMemo } from "react";
import { ProductType, AffiliateProductType } from "@/types/product";
import { AnimatePresence, motion } from "framer-motion";
import ClaimProductFlow from "../DropToCollectionsProducts/ClaimProductFlow";
import Link from "next/link";
import { useAffiliateAvailableProducts } from "@/context/AffiliateAvailableProductsContext";

// Skeleton Component for cleaner code
const ProductCardSkeleton = () => (
    <div>
        <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse" />
        <div className="w-full h-6 bg-gray-200 rounded-md mt-3 animate-pulse" />
        <div className="w-1/2 h-6 bg-gray-200 rounded-md mt-2 animate-pulse" />
        <div className="w-full h-8 bg-gray-200 rounded-md mt-3 animate-pulse" />
    </div>
);

export default function MyProducts() {
    const { userInfos } = useUserInfos();
    const { affiliateAvailableProductsData, isLoadingAffiliateAvailableProducts } = useAffiliateAvailableProducts();
    
    // --- State Management ---
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
        if (!isLoadingAffiliateAvailableProducts) {
            setIsInitialLoad(false);
        }
    }, [isLoadingAffiliateAvailableProducts]);

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

    const shouldShowLoading = isInitialLoad || isLoadingAffiliateAvailableProducts || isLoadingFavorites;

    // --- الإصلاح رقم 1: استخدام useMemo لتجنب إعادة إنشاء المصفوفة في كل مرة ---
    // هذه المصفوفة لن يتم إنشاؤها من جديد إلا إذا تغيرت `affiliateAvailableProductsData` أو `userInfos`.
    const CurrentUserOwnProducts = useMemo(() => {
        if (!userInfos?.email) return [];
        return affiliateAvailableProductsData.filter((p: ProductType) => p.owner?.email === userInfos.email);
    }, [affiliateAvailableProductsData, userInfos]);

    // --- Generate Dynamic Filter Options ---
    const categories = useMemo(() => {
        if (!CurrentUserOwnProducts) return ['All Categories'];
        const uniqueCategories = new Set(CurrentUserOwnProducts.map(p => p.category));
        return ['All Categories', ...Array.from(uniqueCategories)];
    }, [CurrentUserOwnProducts]);

    const colors = useMemo(() => {
        if (!CurrentUserOwnProducts) return ['All Colors'];
        const allColors = CurrentUserOwnProducts.flatMap(p => p.colors || []);
        const uniqueColors = new Set(allColors);
        return ['All Colors', ...Array.from(uniqueColors)];
    }, [CurrentUserOwnProducts]);

    const sizes = useMemo(() => {
        if (!CurrentUserOwnProducts) return ['All Sizes'];
        const allSizes = CurrentUserOwnProducts.flatMap(p => p.sizes || []);
        const uniqueSizes = new Set(allSizes);
        return ['All Sizes', ...Array.from(uniqueSizes)];
    }, [CurrentUserOwnProducts]);
    const priceOptions = ['All Prices', 'Dh0 - Dh50', 'Dh50 - Dh100', 'Dh100 - Dh200', 'Dh200+'];
    const sortOptions = ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest'];
    
    // --- الإصلاح رقم 2: حساب المنتجات المفلترة مباشرة باستخدام useMemo بدلاً من useEffect ---
    // هذا يلغي الحاجة لـ useState و useEffect الخاص بـ filteredProducts تمامًا
    const filteredProducts = useMemo(() => {
        let products = [...CurrentUserOwnProducts];

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
                const price = p.original_sale_price;
                if (selectedPrice === 'Dh0 - Dh50') return price >= 0 && price <= 50;
                if (selectedPrice === 'Dh50 - Dh100') return price > 50 && price <= 100;
                if (selectedPrice === 'Dh100 - Dh200') return price > 100 && price <= 200;
                if (selectedPrice === 'Dh200+') return price > 200;
                return true;
            });
        }
        // يمكن دمج الترتيب هنا مباشرة
        products.sort((a, b) => {
            switch (sortBy) {
                case 'Price: Low to High': return a.original_sale_price - b.original_sale_price;
                case 'Price: High to Low': return b.original_sale_price - a.original_sale_price;
                case 'Newest': 
                    // If createdAt is a Firestore Timestamp, use .toDate()
                    const bDate = typeof b.createdAt?.toDate === 'function' ? b.createdAt.toDate() : new Date(b.createdAt.toDate());
                    const aDate = typeof a.createdAt?.toDate === 'function' ? a.createdAt.toDate() : new Date(a.createdAt.toDate());
                    return bDate.getTime() - aDate.getTime();
                case 'Relevance': default: return (b.sales || 0) - (a.sales || 0);
            }
        });

        return products;
    }, [searchTerm, selectedCategory, selectedColor, selectedSize, selectedPrice, sortBy, CurrentUserOwnProducts]);
    
    const handleClaimClick = (product: ProductType | AffiliateProductType) => {
        setProductToClaim(product as ProductType);
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
                        // --- FIX: Determine if the product is a favorite ---
                        const isProductFavorite = favoriteProductIds.has(product.id);

                        return (
                            <ProductCardUI
                                key={product.id}
                                product={product}
                                isAffiliate={userInfos?.UserRole === "affiliate"}
                                // --- FIX: Pass the correct favorite status ---
                                isFavorite={isProductFavorite}
                                // onToggleFavorite is no longer needed as the card handles it
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
                                <LayoutDashboard
                                    size={16}
                                /> Back to Dashboard
                            </Link>
                            {userInfos?.UserRole !== "affiliate" && (
                                <Link 
                                    className={`w-max inline-flex items-center 
                                        gap-2 px-3 py-1.5 rounded-lg 
                                        text-xs bg-neutral-700 border-b border-neutral-800 
                                        text-neutral-100 ring ring-neutral-700
                                        hover:bg-neutral-700/90`}
                                    href={`${userInfos?.UserRole === "seller" ? "/admin/seller/upload-products" : "/admin/affiliate"}`}
                                    prefetch
                                >
                                    <UploadCloud
                                        size={16}
                                    /> Upload Products
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