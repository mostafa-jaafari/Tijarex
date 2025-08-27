"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Search } from 'lucide-react';
import { toast } from 'sonner';

import { ProductType } from '@/types/product';
import { ProductCard } from '@/components/ProductCard';
import { AddToStoreModal } from '@/components/AddToStoreModal';

// --- Helper Components for UI States ---

const SkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-3 animate-pulse">
                <div className="bg-gray-200 aspect-[4/3] rounded-lg"></div>
                <div className="mt-4 h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="mt-2 h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="mt-4 grid grid-cols-2 gap-x-4">
                    <div className="h-10 bg-gray-200 rounded col-span-2"></div>
                </div>
            </div>
        ))}
    </div>
);

const EmptyState = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 md:py-24 px-4 bg-white border border-gray-200 rounded-xl"
    >
        <Heart size={48} className="mx-auto text-gray-300 mb-4" strokeWidth={1.5} />
        <h2 className="text-2xl font-bold text-gray-800">Your Favorites List is Empty</h2>
        <p className="mt-2 text-gray-500">Click the heart icon on any product to save it here for later.</p>
        <Link 
            href="/affiliate/products"
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold bg-teal-600 text-white rounded-lg shadow-sm hover:bg-teal-700 transition-colors"
        >
            <Search size={16} /> Discover Products
        </Link>
    </motion.div>
);

const ErrorMessage = ({ message }: { message: string }) => (
    <div className="text-center py-20 text-red-600 bg-red-50 border border-red-200 rounded-xl">
        <h3 className="text-lg font-semibold">An Error Occurred</h3>
        <p>{message}</p>
    </div>
);

// --- Main Favorites Page Component ---

export default function FavoritesProductsPage() {
    const [favoriteProducts, setFavoriteProducts] = useState<ProductType[]>([]);
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

    const isModalOpen = !!selectedProduct;

    // --- Data Fetching ---
    const fetchFavorites = useCallback(async () => {
        setStatus('loading');
        try {
            const res = await fetch('/api/products/favorites');
            if (!res.ok) {
                throw new Error('Failed to fetch favorites. Please try again.');
            }
            const data = await res.json();
            setFavoriteProducts(data.products || []);
            setStatus('success');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
            setStatus('error');
        }
    }, []);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    // --- Modal and Product Actions ---
    
    const handleOpenAddToStore = (product: ProductType) => {
        setSelectedProduct(product);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
    };

    const handleSubmitAddToStore = async (editedProduct: ProductType, commission: number) => {
        const loadingToast = toast.loading("Adding product to your store...");
        try {
            const response = await fetch('/api/affiliate/addproducttostore', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product: editedProduct, commission }),
            });

            if (response.status === 409) {
                toast.error('This product is already in your store.', { id: loadingToast });
            } else if (!response.ok) {
                throw new Error('Failed to add product to your store.');
            } else {
                toast.success('Product added successfully!', { id: loadingToast });
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.', { id: loadingToast });
            console.error(error);
        } finally {
            handleCloseModal();
        }
    };

    const handleProductUnfavorited = (productId: string) => {
        setFavoriteProducts(prevProducts =>
            prevProducts.filter(p => p.id !== productId)
        );
    };

    // --- Content Rendering Logic ---

    const renderContent = () => {
        if (status === 'loading') {
            return <SkeletonLoader />;
        }
        if (status === 'error') {
            return <ErrorMessage message={error || 'Something went wrong.'} />;
        }
        if (favoriteProducts.length === 0) {
            return <EmptyState />;
        }

        return (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                    {favoriteProducts.map((product) => (
                        <motion.div
                            layout
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                            <ProductCard
                                product={product}
                                onUnfavorited={handleProductUnfavorited}
                                onAddToStore={handleOpenAddToStore} // Corrected handler name
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        );
    };

    return (
        <>
            <section className='w-full h-full p-4 md:p-6 bg-gray-50/70'>
                <header className='p-6 md:p-8 bg-white border border-gray-200 rounded-xl mb-8'>
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                                My Favorites
                            </h1>
                            <p className="mt-2 text-base text-gray-600 max-w-3xl">
                                Your personal collection of must-have products, ready to be added to your store.
                            </p>
                        </div>
                        {status === 'success' && favoriteProducts.length > 0 && (
                            <span className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
                                <Heart size={16} className="text-teal-500" />
                                {favoriteProducts.length} items
                            </span>
                        )}
                    </div>
                </header>

                <main>
                    {renderContent()}
                </main>
            </section>
            
            <AddToStoreModal
                isOpen={isModalOpen}
                product={selectedProduct}
                onClose={handleCloseModal}
                onSubmit={handleSubmitAddToStore}
            />
        </>
    );
}