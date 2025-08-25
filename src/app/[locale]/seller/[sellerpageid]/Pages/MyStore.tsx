// Example Path: app/[locale]/store/[affiliateId]/page.tsx
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, ArrowRight, Instagram, Facebook, Twitter } from 'lucide-react';
import Image from 'next/image';

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

interface Affiliate {
  name: string;
  storeName: string;
  avatarUrl: string;
  bio: string;
  socials: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

// --- MOCK DATA (Replace with data fetched from your server) ---
const mockAffiliate: Affiliate = {
  name: "Mostafa Jaafari",
  storeName: "Mostafa's Tech Picks",
  avatarUrl: "/path-to-mostafa-avatar.jpg", // Replace with a real path or the user's avatar URL
  bio: "Welcome to my personally curated collection of the best tech on the market. As a passionate developer and tech enthusiast, I only recommend products I believe in and use myself.",
  socials: {
    instagram: "#",
    facebook: "#",
    twitter: "#",
  }
};

const mockProducts: ProductType[] = [
  // This data should be fetched for the specific affiliate
  { id: '1', name: 'Wireless Headphones Pro', product_images: ['/images/product-1.jpg'], sale_price: 299.99, regular_price: 349.99, currency: 'Dh', sales: 1250, stock: 45 },
  { id: '2', name: 'Smart Office Desk', product_images: ['/images/product-2.jpg'], sale_price: 275.00, regular_price: 350.00, currency: 'Dh', sales: 0, stock: 95 },
  { id: '3', name: 'Minimalist Bluetooth Speaker', product_images: ['/images/product-3.jpg'], sale_price: 249.00, regular_price: 299.00, currency: 'Dh', sales: 0, stock: 100 },
  { id: '4', name: 'Portable Laptop Stand', product_images: ['/images/product-4.jpg'], sale_price: 249.00, regular_price: 299.00, currency: 'Dh', sales: 0, stock: 100 },
  { id: '5', name: '4K Ultra-Wide Monitor', product_images: ['/images/product-1.jpg'], sale_price: 450.00, regular_price: 599.00, currency: 'Dh', sales: 830, stock: 20 },
  { id: '6', name: 'Ergonomic Mouse', product_images: ['/images/product-2.jpg'], sale_price: 99.00, regular_price: 120.00, currency: 'Dh', sales: 2100, stock: 150 },
];

// --- PLACEHOLDER PRODUCT CARD (Replace with your actual ProductCard component) ---
const ProductCard = ({ product }: { product: ProductType }) => (
    <div className="font-sans bg-[#1e1e1e] border border-neutral-800 rounded-lg overflow-hidden group p-3 transition-all duration-300 ease-in-out hover:shadow-xl hover:border-teal-500/50 hover:-translate-y-1">
        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
            <Image src={product.product_images[0]} alt={product.name} fill sizes="100vw" className="object-cover w-full h-full" />
        </div>
        <div className="pt-4">
            <h3 className="font-semibold text-neutral-200 truncate">{product.name}</h3>
            <div className="flex items-baseline gap-2 mt-2">
                <span className="text-lg font-bold text-teal-400">{product.sale_price.toFixed(2)} {product.currency}</span>
                {product.regular_price > product.sale_price && <span className="text-sm text-neutral-500 line-through">{product.regular_price.toFixed(2)} {product.currency}</span>}
            </div>
             <div className="mt-4 flex items-center justify-between text-sm text-neutral-400">
                <div className="flex items-center gap-1.5">
                    <span>Sales:</span>
                    <span className="font-semibold text-white">{product.sales.toLocaleString()}</span>
                </div>
                 <div className="flex items-center gap-1.5">
                    <span>Stock:</span>
                    <span className="font-semibold text-white">{product.stock.toLocaleString()}</span>
                </div>
            </div>
        </div>
    </div>
);


// --- THE MAIN AFFILIATE STORE PAGE COMPONENT ---
export default function MyStore() {
    // In a real app, you would fetch the affiliate and their products based on a URL parameter
    const [affiliate, setAffiliate] = useState<Affiliate>(mockAffiliate);
    const [products, setProducts] = useState<ProductType[]>(mockProducts);
    
    // Smooth scroll to products section
    const handleScrollToProducts = () => {
        document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="bg-[#111] text-white font-sans">
            {/* HERO SECTION */}
            <header className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center bg-[url('/path-to-abstract-background.jpg')] opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
                <div className="relative z-10 p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="mb-6"
                    >
                        <Image
                            src={affiliate.avatarUrl}
                            alt={affiliate.name}
                            width={120}
                            height={120}
                            className="rounded-full mx-auto border-4 border-neutral-800 shadow-lg"
                        />
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-4xl md:text-6xl font-bold tracking-tight text-white"
                    >
                        {affiliate.storeName}
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-4 max-w-2xl mx-auto text-lg text-neutral-400"
                    >
                        {affiliate.bio}
                    </motion.p>
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        onClick={handleScrollToProducts}
                        className="mt-8 px-8 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-500 transition-colors flex items-center gap-2 mx-auto"
                    >
                        Explore Products <ArrowRight size={18} />
                    </motion.button>
                </div>
            </header>

            {/* PRODUCTS SECTION */}
            <main id="products-section" className="py-20 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
                        <h2 className="text-3xl font-bold text-white">My Collection</h2>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative w-full md:w-64">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                                <input type="text" placeholder="Search products..." className="w-full bg-[#1e1e1e] border border-neutral-700 rounded-lg py-2.5 pl-9 pr-3 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-colors" />
                            </div>
                            <div className="relative">
                                <select className="appearance-none w-full bg-[#1e1e1e] border border-neutral-700 rounded-lg py-2.5 pl-3 pr-8 text-white focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-colors">
                                    <option>Sort by: Best Selling</option>
                                    <option>Sort by: Price Low-High</option>
                                    <option>Sort by: Price High-Low</option>
                                </select>
                                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product, index) => (
                           <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                           >
                                <ProductCard product={product} />
                           </motion.div>
                        ))}
                    </div>
                </div>
            </main>
            
            {/* FOOTER */}
            <footer className="bg-black py-12 px-4 md:px-8 border-t border-neutral-800">
                <div className="max-w-7xl mx-auto text-center">
                    <h4 className="text-lg font-semibold text-white">Follow {affiliate.name}</h4>
                    <div className="flex justify-center gap-6 mt-4">
                        {affiliate.socials.instagram && <a href={affiliate.socials.instagram} className="text-neutral-400 hover:text-teal-400"><Instagram /></a>}
                        {affiliate.socials.facebook && <a href={affiliate.socials.facebook} className="text-neutral-400 hover:text-teal-400"><Facebook /></a>}
                        {affiliate.socials.twitter && <a href={affiliate.socials.twitter} className="text-neutral-400 hover:text-teal-400"><Twitter /></a>}
                    </div>
                    <p className="text-sm text-neutral-500 mt-8">
                        Copyright © {new Date().getFullYear()} {affiliate.storeName}. All rights reserved.
                    </p>
                     <p className="text-sm text-neutral-600 mt-2">
                        Powered by <a href="#" className="font-semibold text-teal-500 hover:underline">Tijarex</a>
                    </p>
                </div>
            </footer>
        </div>
    );
}