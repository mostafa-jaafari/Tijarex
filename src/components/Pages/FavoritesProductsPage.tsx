"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion'; // Added AnimatePresence and motion
import { Heart, Home } from 'lucide-react';
import { PrimaryDark } from '@/app/[locale]/page';
import { ProductCardUI } from '../UI/ProductCardUI'; 
import { AffiliateProductType, ProductType } from '@/types/product';
import { useUserInfos } from '@/context/UserInfosContext';

// --- NEW: Import the modal component for claiming products ---
import ClaimProductFlow from '../DropToCollectionsProducts/ClaimProductFlow';

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
            return <EmptyState />;
        }

        return (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
        );
    };

    return (
        <div className="p-3 space-y-3">
            <header className="p-6 rounded-lg border border-gray-200 bg-gradient-to-r from-[#1A1A1A] via-neutral-800 to-[#1A1A1A]">
                <h1 className="text-3xl font-bold tracking-tight text-white">My Favorites</h1>
                <p className="mt-2 text-gray-400">Your personal collection of must-have products.</p>
            </header>
            
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

const EmptyState = () => (
    <div className="text-center py-20 text-gray-500">
        <Heart size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-black">Your Favorites List is Empty</h2>
        <p className="mt-2">Click the heart icon on any product to save it here for later.</p>
        <Link 
            className={`mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold hover:from-black hover:to-black ${PrimaryDark}`}
            href="/seller/products" prefetch>
            <Home size={18} /> Discover Products
        </Link>
    </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
    <div className="text-center py-20 text-red-500">
        <p>{message}</p>
    </div>
);