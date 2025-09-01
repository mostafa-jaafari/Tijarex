"use client";

import { PrimaryDark, PrimaryLight } from "@/app/[locale]/page";
import { useQuickViewProduct } from "@/context/QuickViewProductContext";
import { ProductType } from "@/types/product";
import { BadgeCheck, Heart, ShoppingCart, Star, X, Check, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Helper function (assuming it exists elsewhere)
const CalculateDiscount = (salePrice?: number, regularPrice?: number) => {
    if (!salePrice || !regularPrice || regularPrice <= salePrice) return 0;
    return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
};

// ============================================================================
// Skeleton Loader Component for a Better UX
// ============================================================================
const QuickViewSkeleton = () => (
    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
        {/* Image Skeleton */}
        <div className="space-y-3">
            <div className="w-full aspect-square bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-5 gap-3">
                <div className="w-full aspect-square bg-gray-200 rounded-md"></div>
                <div className="w-full aspect-square bg-gray-200 rounded-md"></div>
                <div className="w-full aspect-square bg-gray-200 rounded-md"></div>
                <div className="w-full aspect-square bg-gray-200 rounded-md"></div>
            </div>
        </div>
        {/* Details Skeleton */}
        <div className="space-y-6">
            <div className="space-y-3">
                <div className="h-8 w-3/4 bg-gray-200 rounded-md"></div>
                <div className="h-5 w-1/2 bg-gray-200 rounded-md"></div>
            </div>
            <div className="h-6 w-1/3 bg-gray-200 rounded-md"></div>
            <div className="h-16 w-full bg-gray-200 rounded-md"></div>
            <div className="flex gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-12 w-full bg-gray-200 rounded-lg mt-4"></div>
            <div className="h-12 w-full bg-gray-200 rounded-lg"></div>
        </div>
    </div>
);


// ============================================================================
// Main QuickView Component
// ============================================================================
export function QuickViewProduct() {
    const { isShowQuickViewProduct, setIsShowQuickViewProduct, productID } = useQuickViewProduct();
    const modalRef = useRef<HTMLDivElement | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProductDetails, setSelectedProductDetails] = useState<ProductType | null>(null);
    
    // States for UI interaction
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    // Fetch product details when the modal is opened
    useEffect(() => {
        const handleFetchProductDetails = async () => {
            if (!productID) return;
            setIsLoading(true);
            setSelectedProductDetails(null); // Clear previous product
            try {
                const res = await fetch("/api/products"); // Replace with a specific product fetch if possible: `/api/products/${productID}`
                const { products } = await res.json();
                if (Array.isArray(products)) {
                    const product = products.find((p: ProductType) => p.id === productID);
                    setSelectedProductDetails(product || null);
                    // Pre-select the first color
                    if (product && product.colors.length > 0) {
                        setSelectedColor(product.colors[0]);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch product details:", err);
            } finally {
                setIsLoading(false);
            }
        };

        handleFetchProductDetails();
    }, [productID]);

    // Handle closing modal on outside click
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                setIsShowQuickViewProduct(false);
            }
        };
        if (isShowQuickViewProduct) {
            document.addEventListener("mousedown", handleOutsideClick);
        }
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [isShowQuickViewProduct, setIsShowQuickViewProduct]);

    // Reset state when modal closes
    useEffect(() => {
        if (!isShowQuickViewProduct) {
            setCurrentImageIndex(0);
            setQuantity(1);
            setSelectedColor(null);
        }
    }, [isShowQuickViewProduct]);

    if (!isShowQuickViewProduct) return null;

    const productImages = selectedProductDetails?.product_images || [];
    const productColors = selectedProductDetails?.colors || [];

    return (
        <section className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 transition-opacity duration-300">
            <div
                ref={modalRef}
                className={`relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl p-6 md:p-8 overflow-y-auto transition-all duration-300 ${
                    isShowQuickViewProduct ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
            >
                {/* Close Button */}
                <button
                    onClick={() => setIsShowQuickViewProduct(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors z-10"
                >
                    <X size={24} />
                </button>

                {isLoading || !selectedProductDetails ? (
                    <QuickViewSkeleton />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Side: Image Gallery */}
                        <div className="flex flex-col gap-3">
                            <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                <Image
                                    src={productImages[currentImageIndex] || "/placeholder.png"}
                                    alt={selectedProductDetails.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority
                                />
                            </div>
                            <div className="grid grid-cols-5 gap-3">
                                {productImages.map((pic, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`relative w-full aspect-square rounded-md overflow-hidden transition-all duration-200 ${
                                            currentImageIndex === idx ? "ring-2 ring-purple-600" : "hover:opacity-80"
                                        }`}
                                    >
                                        <Image src={pic || "/placeholder.png"} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right Side: Product Details */}
                        <div className="flex flex-col gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{selectedProductDetails.title}</h1>
                                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                    <span>Sold by:</span>
                                    <span className="font-semibold text-purple-600 flex items-center gap-1">
                                        {selectedProductDetails.owner?.name} <BadgeCheck size={16} className="text-purple-600" />
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-baseline gap-2">
                                    <ins className="text-2xl font-bold text-gray-800 no-underline">
                                        {selectedProductDetails.original_sale_price} Dh
                                    </ins>
                                    <del className="text-gray-400">{selectedProductDetails.original_regular_price} Dh</del>
                                </div>
                                <div className="text-sm font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                                    {CalculateDiscount(selectedProductDetails.original_sale_price, selectedProductDetails.original_regular_price)}% OFF
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm border-b pb-4">
                                <div className="flex items-center text-yellow-500">
                                    {Array(5).fill(0).map((_, idx) => (
                                        <Star key={idx} size={16} className={idx < (selectedProductDetails.rating || 0) ? "fill-current" : "fill-gray-300"} />
                                    ))}
                                </div>
                                <span className="text-gray-500">
                                    {selectedProductDetails.rating?.toFixed(1)} ({selectedProductDetails.reviews?.length || 0} reviews)
                                </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 leading-relaxed">{selectedProductDetails.description}</p>
                            
                            {productColors.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="text-sm font-semibold text-gray-800">Color: <span className="font-normal text-gray-600">{selectedColor}</span></h3>
                                    <div className="flex items-center gap-3">
                                        {productColors.map((col) => (
                                            <button
                                                key={col}
                                                onClick={() => setSelectedColor(col)}
                                                style={{ backgroundColor: col }}
                                                className={`w-8 h-8 rounded-full border border-neutral-300 transition-all 
                                                    duration-200 flex items-center justify-center
                                                    ${selectedColor === col ? "ring-2 ring-offset-2 ring-purple-600 border-white" : "hover:border-gray-300"
                                                }`}
                                            >
                                                {selectedColor === col && <Check size={16} className="text-white" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-4 mt-auto pt-4">
                                <div 
                                    className="flex items-center border-b border-gray-400 
                                        ring ring-neutral-200 rounded-lg overflow-hidden">
                                    <button 
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                                        className="p-3 text-gray-600 hover:bg-gray-200 cursor-pointer"
                                    >
                                        <Minus 
                                            size={16}
                                        />
                                    </button>
                                    <span className="px-4 font-semibold">{quantity}</span>
                                    <button 
                                        onClick={() => setQuantity(q => q + 1)} 
                                        className="p-3 text-gray-600 hover:bg-gray-200 cursor-pointer"
                                    >
                                        <Plus 
                                            size={16}
                                        />
                                    </button>
                                </div>
                                <button 
                                    className={`flex-1 flex items-center justify-center 
                                        gap-2 cursor-pointer text-purple-100
                                        hover:border-purple-500 text-sm
                                        border-b border-purple-900 ring ring-purple-600
                                        py-2 rounded-lg bg-gradient-to-r 
                                        from-purple-600 via-purple-500 to-purple-600
                                        transition-all duration-200`}
                                >
                                    <ShoppingCart size={18} /> Add to Cart
                                </button>
                            </div>
                            
                            <button 
                                className={`w-full flex items-center justify-center 
                                    gap-2 ${PrimaryLight} py-2 hover:bg-neutral-50
                                    transition-colors`}
                            >
                                <Heart size={18} /> Add to Wishlist
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}