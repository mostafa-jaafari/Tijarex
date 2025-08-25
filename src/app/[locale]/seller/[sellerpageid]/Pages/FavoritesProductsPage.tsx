"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Home, ArrowLeft, ArrowRight, Box, BarChart2, Eye, Flame } from 'lucide-react';
import { toast } from 'sonner';
import { useQuickViewProduct } from '@/context/QuickViewProductContext';
import { BlackButtonStyles } from '@/components/Header';

// --- DATA TYPE (Ensure this matches your global ProductType) ---
interface ProductType {
  id: string;
  title: string; // Using 'title' as per your last card component
  product_images: string[];
  sale_price: number;
  regular_price: number;
  currency: string;
  sales: number;
  stock: number;
}


// --- THE MAIN FAVORITES PAGE COMPONENT ---
export default function FavoritesProductsPage() {
    const [favoriteProducts, setFavoriteProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Data Fetching ---
    useEffect(() => {
        const fetchFavorites = async () => {
            setLoading(true);
            setError(null);
            try {
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

    // --- Callback function for the card to update the page's state ---
    const handleProductUnfavorited = (productId: string) => {
        // Immediately remove the product from the UI for a smooth experience
        setFavoriteProducts(prevProducts =>
            prevProducts.filter(p => p.id !== productId)
        );
    };

    // --- Logic to render the main content based on state ---
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
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoriteProducts.map((product, index) => (
                   <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                   >
                       <FavoriteProductCard 
                            product={product} 
                            onUnfavorited={handleProductUnfavorited} 
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
        </div>
    );
}


// --- 1. THE FULLY SELF-CONTAINED CARD COMPONENT ---
// This component lives only inside this file.
interface FavoriteCardProps {
    product: ProductType;
    onUnfavorited: (productId: string) => void;
}

const FavoriteProductCard = ({ product, onUnfavorited }: FavoriteCardProps) => {
    // --- All card-specific state and logic is encapsulated here ---
    const { setIsShowQuickViewProduct, setProductID } = useQuickViewProduct();
    const [currentImage, setCurrentImage] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    // Since we are on the favorites page, we can assume it's true initially.
    const [isFavorite, setIsFavorite] = useState(true);

    const handleQuickView = () => {
        setProductID(product.id);
        setIsShowQuickViewProduct(true);
    };

    const handleImageNavigation = (e: React.MouseEvent, direction: number) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImage((prev) => (prev + direction + product.product_images.length) % product.product_images.length);
    };

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Optimistically update UI
        setIsFavorite(false);

        try {
            const response = await fetch('/api/products/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: product.id }),
            });

            if (!response.ok) throw new Error('Failed to update favorites.');
            
            const result = await response.json();
            // If the server confirms it's no longer a favorite, call the parent to remove it from the list
            if (!result.isFavorite) {
                toast.success('Removed from favorites.');
                onUnfavorited(product.id);
            }
        } catch (error) {
            // If the API call fails, revert the UI change
            setIsFavorite(true);
            toast.error((error as Error).message);
        }
    };
    
    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="font-sans bg-white border border-gray-200 
                rounded-lg overflow-hidden group p-3 
                transition-all duration-300 ease-in-out 
                hover:shadow-xl hover:-translate-y-0.5"
        >
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
                <Link href={`/seller/products?p_id=${product.id}`} className="block w-full h-full">
                    <AnimatePresence initial={false}>
                        <motion.div key={currentImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0">
                            <Image src={product.product_images[currentImage]} alt={product.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover w-full h-full" />
                        </motion.div>
                    </AnimatePresence>
                </Link>

                {product.sales > 500 && <p className='py-1 px-2 text-orange-400 rounded-full flex items-center gap-1 text-xs font-semibold bg-orange-900 shadow-sm absolute top-3 left-3'><Flame size={16} className='fill-current' /> Hot Seller</p>}
                
                <motion.button onClick={toggleFavorite} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full cursor-pointer backdrop-blur-sm bg-black/20 transition-colors duration-300 ${isFavorite ? 'text-teal-400' : 'text-white'}`}>
                    <Heart className={`w-5 h-5 transition-all ${isFavorite ? 'fill-current' : ''}`} />
                </motion.button>

                {product.product_images.length > 1 && (
                    <>
                        <AnimatePresence>
                           {isHovered && (
                                <>
                                    <motion.button onClick={(e) => handleImageNavigation(e, -1)} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="absolute top-1/2 left-2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white"> <ArrowLeft size={16} /> </motion.button>
                                    <motion.button onClick={(e) => handleImageNavigation(e, 1)} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="absolute top-1/2 right-2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white"> <ArrowRight size={16} /> </motion.button>
                                </>
                            )}
                        </AnimatePresence>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                            {product.product_images.map((_, i) => (<div key={i} onClick={() => setCurrentImage(i)} className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${i === currentImage ? 'w-5 bg-white' : 'w-1.5 bg-white/60'}`} />))}
                        </div>
                    </>
                )}
            </div>

            <div className="pt-3 px-1">
                <h3 className="font-semibold text-neutral-800 truncate"><Link href={`/seller/products?p_id=${product.id}`}>{product.title}</Link></h3>
                <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-lg font-bold text-teal-600">{product.sale_price.toFixed(2)} {product.currency}</span>
                    {product.regular_price > product.sale_price && <span className="text-sm text-gray-400 line-through">{product.regular_price.toFixed(2)} {product.currency}</span>}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-x-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><BarChart2 size={16} className="text-gray-400" /><div><div className="font-semibold">{product.sales.toLocaleString()}</div><div className="text-xs text-gray-400">Sales</div></div></div>
                    <div className="flex items-center gap-2"><Box size={16} className="text-gray-400" /><div><div className="font-semibold">{product.stock.toLocaleString()}</div><div className="text-xs text-gray-400">Stock</div></div></div>
                </div>
                <div className="group-hover:mt-3 h-0 group-hover:h-[44px] transition-all duration-200">
                    <motion.div animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 5 }} initial={{ opacity: 0, y: 5 }} transition={{ duration: 0.25, ease: 'easeInOut' }} className="flex items-center">
                        <button onClick={handleQuickView} className="w-full border border-gray-200 cursor-pointer shadow-sm flex justify-center p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                            <Eye size={16} />
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};


// --- 2. HELPER COMPONENTS FOR UI STATES ---

const SkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-3 animate-pulse">
                <div className="bg-gray-200 aspect-[4/3] rounded-lg"></div>
                <div className="mt-4 h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="mt-2 h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
        ))}
    </div>
);

const EmptyState = () => (
    <div className="text-center py-20 text-gray-500">
        <Heart size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-black">Your Favorites List is Empty</h2>
        <p className="mt-2">Click the heart icon on any product to save it here for later.</p>
        <Link href="/seller/products" legacyBehavior>
            <a 
                className={`mt-6 inline-flex items-center gap-2 
                    px-6 py-2.5 rounded-lg 
                    font-semibold hover:from-black hover:to-black
                    ${BlackButtonStyles}`}>
                <Home size={18} /> Discover Products
            </a>
        </Link>
    </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
    <div className="text-center py-20 text-red-500">
        <p>{message}</p>
    </div>
);