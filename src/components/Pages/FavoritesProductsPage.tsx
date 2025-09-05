"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion'; // Added AnimatePresence and motion
import { Box, HeartOff, LayoutDashboard } from 'lucide-react';import { ProductCardUI } from '../UI/ProductCardUI'; 
import { AffiliateProductType, ProductType } from '@/types/product';
import { useUserInfos } from '@/context/UserInfosContext';

// --- NEW: Import the modal component for claiming products ---
import ClaimProductFlow from '../DropToCollectionsProducts/ClaimProductFlow';
import { UserInfosType } from '@/types/userinfos';

// --- THE MAIN FAVORITES PAGE COMPONENT ---
export default function FavoritesProductsPage() {
    const [favoriteProducts, setFavoriteProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { userInfos } = useUserInfos();
    
    // --- NEW: State to manage which product is being claimed ---
    const [productToClaim, setProductToClaim] = useState<ProductType | null>(null);

    // --- Data Fetching ---
    useEffect(() => {
        const fetchFavorites = async () => {
            setLoading(true);
            setError(null);
            try {
                // Corrected the API endpoint
                const res = await fetch('/api/products/favorites'); 
                if (!res.ok) {
                    throw new Error('Failed to fetch favorites. Please log in.');
                }
                const data = await res.json();
                setFavoriteProducts(data.products || []);
            } catch (err) {
                setError((err as { message: string; }).message);
            } finally {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, []);

    // --- Callback to remove product from UI after unfavoriting ---
    const handleFavoriteToggled = (productId: string, isNowFavorite: boolean) => {
        if (!isNowFavorite) {
            setFavoriteProducts(prevProducts =>
                prevProducts.filter(p => p.id !== productId)
            );
        }
    };

    // --- NEW: Handler to open the claim modal ---
    const handleClaimClick = (product: ProductType | AffiliateProductType) => {
        setProductToClaim(product as ProductType);
    };

    // --- Logic to render the grid of product cards ---
    const renderContent = () => {
        if (loading) {
            return <SkeletonLoader />;
        }
        if (error) {
            return <ErrorMessage message={error} />;
        }
        if (favoriteProducts.length === 0) {
            return <EmptyState userInfos={userInfos} />;
        }

        return (
            <section>
                <header>
                    <h1
                        className='text-xl font-semibold capitalize mb-6'
                    >
                        Favorites Products
                    </h1>
                    {/* --- Sub Title --- */}
                </header>
                <div 
                    className="grid grid-cols-1 sm:grid-cols-2 
                        md:grid-cols-3 lg:grid-cols-4 gap-3"
                >
                    {favoriteProducts.map((product) => (
                    <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                            layout
                    >
                        <ProductCardUI 
                                product={product}
                                isAffiliate={userInfos?.UserRole === "affiliate"}
                                isFavorite={true}
                                onFavoriteToggled={handleFavoriteToggled}
                                // --- FIX: Pass the new handler ---
                                onClaimClick={handleClaimClick} 
                            />
                    </motion.div>
                    ))}
                </div>
            </section>
        );
    };

    return (
        <div className="p-3 space-y-3">
            <main>
                {renderContent()}
            </main>

            {/* --- NEW: Add the Claim Flow Modal --- */}
            <AnimatePresence>
                {productToClaim && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
                        onClick={() => setProductToClaim(null)} // Close modal on overlay click
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
        </div>
    );
}

// --- HELPER COMPONENTS (No changes) ---

const SkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
                <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse" />
                <div className="w-full h-6 bg-gray-200 rounded-md mt-3 animate-pulse" />
                <div className="w-1/2 h-6 bg-gray-200 rounded-md mt-2 animate-pulse" />
                <div className="w-full h-8 bg-gray-200 rounded-md mt-3 animate-pulse" />
            </div>
        ))}
    </div>
);

type EmptyStateProps = {
    userInfos: UserInfosType | null;
};

const EmptyState = ({ userInfos }: EmptyStateProps) => (
    <div className="text-center py-20 text-gray-500 
        bg-white border-b border-neutral-400 ring
        ring-neutral-200 rounded-xl">
        <HeartOff 
            size={48} 
            className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-bold text-neutral-700">Your Favorites List is Empty</h2>
        <p className="mt-2 text-sm">Click the heart icon on any product to save it here for later.</p>
        <div
            className='mt-6 flex justify-center gap-2 w-full'
        >
            <Link 
                className={`w-max inline-flex items-center 
                    gap-2 px-3 py-1.5 rounded-lg font-semibold 
                    text-xs bg-white border-b border-neutral-400 
                    text-neutral-700 ring ring-neutral-200
                    hover:bg-neutral-50`}
                href={`${userInfos?.UserRole === "seller" ? "/seller" : "/affiliate"}`}
                prefetch
            >
                <LayoutDashboard size={16} /> Back to Dashboard
            </Link>
            <Link 
                className={`w-max inline-flex items-center 
                    gap-2 px-3 py-1.5 rounded-lg 
                    text-xs bg-neutral-700 border-b border-neutral-800 
                    text-neutral-100 ring ring-neutral-700
                    hover:bg-neutral-700/90`}
                    href={`${userInfos?.UserRole === "seller" ? "/seller/products" : "/affiliate/products"}`}
                    prefetch
            >
                <Box size={16} /> Discover Products
            </Link>
        </div>
    </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
    <div className="text-center py-20 text-red-500">
        <p>{message}</p>
    </div>
);