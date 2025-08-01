"use client";

import { useState, useMemo, useCallback } from "react";
import { FakeProducts } from "./FakeProducts";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

// Types for better type safety
interface Product {
    id: number;
    image: string;
    title: string;
    description: string;
    price: number;
    rating: number;
    category: string;
    originalPrice: number;
}

interface CategoryTab {
    name: string;
    label: string;
    icon?: string;
}

export function FeaturedProducts() {
    const t = useTranslations("");
    const locale = useLocale();
    const [selectedTabCategorie, setSelectedTabCategorie] = useState("all");
    const [isLoading, setIsLoading] = useState(false);

    // Categories with icons for better UX
    const Categories_Tabs: CategoryTab[] = useMemo(() => [
        {
            name: "all",
            label: t("featuredproducts.tabs.0"),
            icon: "🏪"
        },
        {
            name: "electronics",
            label: t("featuredproducts.tabs.1"),
            icon: "📱"
        },
        {
            name: "fashion",
            label: t("featuredproducts.tabs.2"),
            icon: "👕"
        },
        {
            name: "home-appliances",
            label: t("featuredproducts.tabs.3"),
            icon: "🏠"
        },
    ], [t]);

    // Optimized filtering with useMemo for performance
    const filteredProducts = useMemo(() => {
        if (selectedTabCategorie === "all") {
            return FakeProducts.slice(0, 8); // Show more products
        }
        return FakeProducts.filter((product: Product) => 
            product.category === selectedTabCategorie
        );
    }, [selectedTabCategorie]);

    // Handle category change with loading state
    const handleCategoryChange = useCallback((categoryName: string) => {
        setIsLoading(true);
        setSelectedTabCategorie(categoryName);
        // Simulate loading delay for better UX
        setTimeout(() => setIsLoading(false), 300);
    }, []);

    // Format price with locale support
    const formatPrice = useCallback((price: number) => {
        return new Intl.NumberFormat(locale === 'ar' ? 'ar-MA' : 'en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(price);
    }, [locale]);

    return (
        <section
            id="FeaturedProducts"
            className="w-full min-h-screen flex py-20 
                flex-col 
                items-center bg-gradient-to-b 
                from-white to-blue-50"
        >
            {/* Enhanced header with better typography */}
            <div className="text-center max-w-4xl mx-auto mb-12">
                <h1
                    className={`text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent text-center mb-6 ${
                        locale === "ar" ? "" : "bebas-neue"
                    }`}
                >
                    {t("featuredproducts.title")}
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    {t("featuredproducts.description")}
                </p>
            </div>

            {/* Enhanced category tabs with animations */}
            <div className="w-full flex gap-1 justify-center mb-12 py-1">
                {Categories_Tabs.map((tab, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleCategoryChange(tab.name)}
                        disabled={isLoading}
                        className={`
                            relative flex items-center gap-2 px-4 md:px-6
                            py-1 rounded-full font-medium text-sm
                            md:text-base disabled:opacity-50
                            disabled:cursor-not-allowed cursor-pointer
                            ${selectedTabCategorie === tab.name 
                                ? "bg-blue-500 text-white"
                                : "text-gray-500 hover:bg-blue-50"
                            }
                        `}
                    >
                        {/* <span className="text-lg">{tab.icon}</span> */}
                        <span className="whitespace-nowrap capitalize">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Enhanced products grid */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
                {isLoading ? (
                    // Loading skeleton
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, idx) => (
                            <div key={idx} className="animate-pulse">
                                <div className="bg-gray-200 h-64 rounded-xl mb-4"></div>
                                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                                <div className="bg-gray-200 h-3 rounded mb-2"></div>
                                <div className="bg-gray-200 h-4 rounded w-20"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div 
                        className="grid grid-cols-1 sm:grid-cols-2 
                            lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product: Product) => (
                            <div
                                key={product.id}
                                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden
                                         hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-2
                                         transition-all duration-500 cursor-pointer"
                            >
                                {/* Enhanced image container */}
                                <div className="relative aspect-square overflow-hidden bg-gray-100">
                                    <Image
                                        src={product.image}
                                        fill
                                        loading="lazy"
                                        alt={product.title}
                                        className="object-cover w-full h-full group-hover:scale-110 
                                                 transition-transform duration-700 ease-out"
                                    />
                                    {/* Overlay effects */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent 
                                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    
                                    {/* Quick actions overlay */}
                                    <div className="absolute top-4 right-4 flex flex-col gap-2 
                                                  opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full
                                                         flex items-center justify-center hover:bg-white
                                                         transition-colors duration-200 shadow-lg">
                                            ❤️
                                        </button>
                                        <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full
                                                         flex items-center justify-center hover:bg-white
                                                         transition-colors duration-200 shadow-lg">
                                            👁️
                                        </button>
                                    </div>

                                    {/* Discount badge (if applicable) */}
                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <div className="absolute top-4 left-4 bg-red-500 text-white 
                                                      px-3 py-1 rounded-full text-sm font-bold">
                                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                        </div>
                                    )}
                                </div>

                                {/* Enhanced product info */}
                                <div className="p-6">
                                    <div className="mb-3">
                                        <h3 className="text-lg font-bold text-gray-800 mb-2 
                                                     group-hover:text-blue-600 transition-colors duration-300
                                                     line-clamp-2">
                                            {product.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                                            {product.description}
                                        </p>
                                    </div>

                                    {/* Rating (if available) */}
                                    {product.rating && (
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i}>
                                                        {i < Math.floor(product.rating!) ? "★" : "☆"}
                                                    </span>
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                ({product.rating?.toFixed(1)})
                                            </span>
                                        </div>
                                    )}

                                    {/* Enhanced pricing */}
                                    <div className="flex items-center gap-2 mb-4" dir="ltr">
                                        <span className="text-xl font-bold text-blue-600">
                                            {formatPrice(product.price)}
                                        </span>
                                        {product.originalPrice && product.originalPrice > product.price && (
                                            <span className="text-sm text-gray-400 line-through">
                                                {formatPrice(product.originalPrice)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Enhanced CTA button */}
                                    <button
                                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600
                                                 text-white font-semibold rounded-xl
                                                 hover:from-blue-600 hover:to-blue-700
                                                 hover:shadow-lg hover:shadow-blue-500/25
                                                 transform hover:scale-105 active:scale-95
                                                 transition-all duration-300 ease-out
                                                 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    >
                                        {t("globalcta")}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Enhanced empty state
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4 opacity-50">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {t("featuredproducts.nofound")}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Try selecting a different category or check back later
                        </p>
                        <button
                            onClick={() => handleCategoryChange("all")}
                            className="px-6 py-3 bg-blue-500 text-white rounded-xl
                                     hover:bg-blue-600 transition-colors duration-300"
                        >
                            View All Products
                        </button>
                    </div>
                )}
            </div>

            {/* Load more button (optional) */}
            {filteredProducts.length > 0 && filteredProducts.length >= 8 && (
                <div className="mt-12">
                    <button className="px-8 py-4 border-2 border-blue-500 text-blue-500 
                                     rounded-xl font-semibold hover:bg-blue-500 hover:text-white
                                     transition-all duration-300 transform hover:scale-105">
                        Load More Products
                    </button>
                </div>
            )}
        </section>
    );
}