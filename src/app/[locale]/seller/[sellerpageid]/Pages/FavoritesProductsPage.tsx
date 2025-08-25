"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Home } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image'; // Placeholder for your ProductCard import

// --- DATA TYPES (Replace with your actual types) ---
interface ProductType {
  id: string;
  name: string;
  product_images: string[];
  sale_price: number;
  regular_price: number;
  currency: string;
  sales: number;
  stock: number;
}

// --- PLACEHOLDER PRODUCT CARD (Replace with your actual ProductCard component) ---
const ProductCard = ({ product }: { product: ProductType }) => (
    <div className="font-sans bg-[#1e1e1e] border border-neutral-800 rounded-lg overflow-hidden group p-3 transition-all duration-300 ease-in-out hover:shadow-xl hover:border-teal-500/50 hover:-translate-y-1">
        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
            <Image src={product.product_images[0] || '/placeholder.png'} alt={product.name} fill sizes="100vw" className="object-cover w-full h-full" />
        </div>
        <div className="pt-4">
            <h3 className="font-semibold text-neutral-200 truncate">{product.name}</h3>
            <div className="flex items-baseline gap-2 mt-2">
                <span className="text-lg font-bold text-teal-400">{product.sale_price.toFixed(2)} {product.currency}</span>
                {product.regular_price > product.sale_price && <span className="text-sm text-neutral-500 line-through">{product.regular_price.toFixed(2)} {product.currency}</span>}
            </div>
        </div>
    </div>
);


// --- THE MAIN FAVORITES PAGE COMPONENT ---
export default function FavoritesProductsPage() {
    const [favoriteProducts, setFavoriteProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    const renderContent = () => {
        if (loading) {
            // Skeleton Loader
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-[#1e1e1e] border border-neutral-800 rounded-lg p-3 animate-pulse">
                            <div className="bg-neutral-700 aspect-[4/3] rounded-lg"></div>
                            <div className="mt-4 h-5 bg-neutral-700 rounded w-3/4"></div>
                            <div className="mt-2 h-6 bg-neutral-700 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-20">
                    <p className="text-red-400">{error}</p>
                </div>
            );
        }

        if (favoriteProducts.length === 0) {
            return (
                 <div className="text-center py-20 text-neutral-400">
                    <Heart size={48} className="mx-auto text-neutral-600 mb-4" />
                    <h2 className="text-2xl font-bold text-white">Your Favorites List is Empty</h2>
                    <p className="mt-2">Click the heart icon on any product to save it here for later.</p>
                    <Link href="/seller/products" legacyBehavior>
                        <a className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-500 transition-colors">
                            <Home size={18} /> Discover Products
                        </a>
                    </Link>
                </div>
            );
        }

        return (
             <div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
                    xl:grid-cols-4 gap-6">
                {favoriteProducts.map((product, index) => (
                   <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                   >
                       {/* Make sure your ProductCard component can accept a product prop */}
                        <ProductCard product={product} />
                   </motion.div>
                ))}
            </div>
        );
    };

    return (
        <div className="">
            <div className="max-w-7xl mx-auto py-12 px-4 md:px-8">
                 <div className="mb-10">
                    <h1 className="text-4xl font-bold tracking-tight text-white">My Favorites</h1>
                    <p className="mt-2 text-neutral-400">Your personal collection of must-have products.</p>
                </div>
                {renderContent()}
            </div>
        </div>
    );
}