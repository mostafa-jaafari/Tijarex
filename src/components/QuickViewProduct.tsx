"use client";

import { useUserInfos } from "@/context/UserInfosContext"; // Kept for role-based UI
import { BadgeCheck, Heart, ShoppingCart, Star, X, Check, Minus, Plus, Copy } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { HandleGetRefLink } from "./Functions/GetAffiliateLink"; // Specific logic
import { useFirstAffiliateLink } from "@/context/FirstAffiliateLinkContext"; // Specific logic

// Helper function
const CalculateDiscount = (salePrice?: number, regularPrice?: number) => {
    if (!salePrice || !regularPrice || regularPrice <= salePrice) return 0;
    return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
};

// ============================================================================
// PROPS INTERFACE FOR THE REUSABLE COMPONENT
// ============================================================================
interface QuickViewProductProps {
    // Controls modal visibility
    isVisible: boolean;
    onClose: () => void;

    // Generic Product Data (Uppercased for clarity)
    ID: string;
    TITLE: string;
    DESCRIPTION?: string;
    SALE_PRICE: number;
    REGULAR_PRICE?: number;
    PRODUCT_IMAGES: string[];
    COLORS?: string[];
    SIZES?: string[];
    OWNER_NAME?: string;
    RATING?: number;
    REVIEW_COUNT?: number;
    
    // Callbacks for actions
    onAddToCart: (details: { id: string; quantity: number; color: string | null; size: string | null; }) => void;
    onAddToWishlist: (id: string) => void;
    // getLink is very specific, so it's handled internally for now using contexts
}


// ============================================================================
// SINGLE, UNIFIED QUICK VIEW COMPONENT
// ============================================================================
export function QuickViewProduct({
    isVisible,
    onClose,
    ID,
    TITLE,
    DESCRIPTION,
    SALE_PRICE,
    REGULAR_PRICE,
    PRODUCT_IMAGES = [],
    COLORS = [],
    SIZES = [],
    OWNER_NAME,
    RATING = 0,
    REVIEW_COUNT = 0,
    onAddToCart,
    onAddToWishlist,
}: QuickViewProductProps) {
    // Hooks for specific business logic (can be removed if not needed)
    const { userInfos } = useUserInfos();
    const { hasGottenFirstLink, markAsGotten } = useFirstAffiliateLink();

    // Refs and internal UI state
    const modalRef = useRef<HTMLDivElement | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    // Handle closing modal on outside click
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        if (isVisible) {
            document.addEventListener("mousedown", handleOutsideClick);
        }
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [isVisible, onClose]);

    // Reset internal state when modal becomes hidden or when the product ID changes
    useEffect(() => {
        if (!isVisible) {
            setCurrentImageIndex(0);
            setQuantity(1);
            setSelectedColor(null);
            setSelectedSize(null);
        } else {
            // Pre-select first color/size when a new product is shown
            setSelectedColor(COLORS.length > 0 ? COLORS[0] : null);
            setSelectedSize(SIZES.length > 0 ? SIZES[0] : null);
        }
    }, [isVisible, ID, COLORS, SIZES]);


    if (!isVisible) return null;
    
    const userRole = userInfos?.UserRole || "guest";

    // Specific handler for affiliate links
    const handleGetLink = () => {
        if (userInfos?.uniqueuserid) {
            HandleGetRefLink(ID, userInfos.uniqueuserid, hasGottenFirstLink, markAsGotten);
        }
    };
    
    return (
        <section 
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm 
                flex justify-center items-center p-4 transition-opacity 
                duration-300">
            <div
                ref={modalRef}
                className={`relative w-full max-w-4xl max-h-[80vh] bg-white rounded-xl shadow-2xl p-6 md:p-8 overflow-y-auto transition-all duration-300 ${
                    isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
            >
                {/* --- Main Content Grid --- */}
                <div className="relative">
                    <button
                        onClick={onClose}
                        className="absolute top-[-8px] right-[-8px] md:top-0 md:right-0 cursor-pointer 
                            text-gray-400 hover:text-gray-800 
                            transition-colors z-20 bg-white rounded-full p-1"
                    >
                        <X size={24} />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Side: Image Gallery */}
                        <div className="flex flex-col gap-3">
                            <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                <Image
                                    src={PRODUCT_IMAGES[currentImageIndex] || "/placeholder.png"}
                                    alt={TITLE}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority
                                />
                            </div>
                            <div className="grid grid-cols-5 gap-3">
                                {PRODUCT_IMAGES.map((pic, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`relative w-full aspect-square rounded-md overflow-hidden transition-all duration-200 ${
                                            currentImageIndex === idx
                                                ? "ring-2 ring-purple-500"
                                                : "opacity-70 hover:opacity-100"
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
                                <h1 className="text-3xl font-bold text-gray-900">{TITLE}</h1>
                                {(userRole === "seller" || userRole === "affiliate") && OWNER_NAME && (
                                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                        <span>Sold by:</span>
                                        <span className="font-semibold text-purple-600 flex items-center gap-1">
                                            {OWNER_NAME} <BadgeCheck size={16} className="text-purple-600" />
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-baseline gap-2">
                                    <ins className="text-2xl font-bold text-gray-800 no-underline">{SALE_PRICE} Dh</ins>
                                    {REGULAR_PRICE && REGULAR_PRICE > SALE_PRICE && (
                                        <del className="text-gray-400">{REGULAR_PRICE} Dh</del>
                                    )}
                                </div>
                                <div className="text-sm font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                                    {CalculateDiscount(SALE_PRICE, REGULAR_PRICE)}% OFF
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm border-b border-neutral-200 pb-4">
                                <div className="flex items-center text-yellow-500">
                                    {Array(5).fill(0).map((_, idx) => (
                                        <Star key={idx} size={16} className={idx < RATING ? "fill-current" : ""} />
                                    ))}
                                </div>
                                <span className="text-gray-500">{RATING.toFixed(1)} ({REVIEW_COUNT} reviews)</span>
                            </div>
                            
                            <p className="text-sm text-gray-600 leading-relaxed">{DESCRIPTION}</p>
                            
                            {COLORS.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="text-sm font-semibold text-gray-800">Color: <span className="font-normal text-gray-600">{selectedColor}</span></h3>
                                    <div className="flex items-center gap-3">
                                        {COLORS.map((col) => (
                                            <button key={col} onClick={() => setSelectedColor(col)} style={{ backgroundColor: col }}
                                                className={`w-8 h-8 rounded-full border border-neutral-300 transition-all duration-200 flex items-center justify-center ${selectedColor === col ? "ring-2 ring-offset-2 ring-purple-600 border-white" : "hover:border-gray-300"}`}
                                            >
                                                {selectedColor === col && <Check size={16} className="text-white" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {SIZES.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="text-sm font-semibold text-gray-800">Size: <span className="font-normal text-gray-600">{selectedSize}</span></h3>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        {SIZES.map((size) => (
                                            <button key={size} onClick={() => setSelectedSize(size)}
                                                className={`rounded-lg border px-3 h-10 border-neutral-300 transition-all duration-200 flex items-center justify-center text-sm ${selectedSize?.toLowerCase() === size.toLowerCase() ? "bg-purple-700 text-white" : "bg-neutral-50 hover:bg-gray-100"}`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2 pt-4">
                                {userRole === "affiliate" ? (
                                    <button onClick={handleGetLink} className="w-full py-3 rounded-lg bg-neutral-800 hover:bg-neutral-900 text-white text-sm font-bold flex items-center gap-2 justify-center">
                                        Get Affiliate Link <Copy size={18}/>
                                    </button>
                                ) : userRole !== "seller" && (
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border rounded-lg overflow-hidden">
                                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 text-gray-600 hover:bg-gray-100"><Minus size={16}/></button>
                                            <span className="px-4 font-semibold">{quantity}</span>
                                            <button onClick={() => setQuantity(q => q + 1)} className="p-3 text-gray-600 hover:bg-gray-100"><Plus size={16}/></button>
                                        </div>
                                        <button onClick={() => onAddToCart({ id: ID, quantity, color: selectedColor, size: selectedSize })} className="flex-1 py-3 flex items-center justify-center gap-2 font-bold text-white text-sm rounded-lg bg-neutral-800 hover:bg-neutral-900">
                                            <ShoppingCart size={18} /> Add to Cart
                                        </button>
                                    </div>
                                )}
                                
                                <button onClick={() => onAddToWishlist(ID)} className="w-full flex items-center justify-center gap-2 font-bold text-white text-sm py-3 rounded-lg bg-purple-700 hover:bg-purple-800">
                                    <Heart size={18} /> Add to Wishlist
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}