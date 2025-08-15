"use client";

import { useQuickViewProduct } from "@/context/QuickViewProductContext";
import { ProductType } from "@/types/product";
import { BadgeCheck, Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CalculateDiscount } from "./Functions/CalculateDiscount";

export function QuickViewProduct() {
    const { isShowQuickViewProduct, setIsShowQuickViewProduct, productID } = useQuickViewProduct();
    const QVPRef = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const [selectedProductDetails, setSelectedProductDetails] = useState<ProductType | null>(null);
    useEffect(() => {
        const handleFetchProductDetails = async () => {
            const Res = await fetch("/api/products");
            const { products } = await Res.json(); // نفك المفتاح الصحيح

            // نتأكد إنها مصفوفة قبل البحث
            if (Array.isArray(products)) {
                const SelectedProduct = products.find(
                    (product: ProductType) => product.id === productID
                );
                setSelectedProductDetails(SelectedProduct as ProductType);
            } else {
                setSelectedProductDetails(null);
            }
        };

        if (productID) {
            handleFetchProductDetails();
        }
    }, [productID]);

    // Sync context state with local animation state
    useEffect(() => {
        if (isShowQuickViewProduct) {
            setIsVisible(true); // Show and start animation
        } else {
            // Delay unmount until animation ends
            const timeout = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timeout);
        }
    }, [isShowQuickViewProduct]);

    // Close when clicking outside
    useEffect(() => {
        const handleHideQVP = (e: MouseEvent) => {
            if (QVPRef.current && !QVPRef.current.contains(e.target as Node)) {
                setIsShowQuickViewProduct(false);
            }
        };
        document.addEventListener("mousedown", handleHideQVP);
        return () => document.removeEventListener("mousedown", handleHideQVP);
    }, [setIsShowQuickViewProduct]);
    
    const [currentImage, setCurrentImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState("");

    if (!isVisible) return null;

    return (
        <section
            className={`fixed z-50 top-0 left-0 w-full h-screen bg-black/40
                flex justify-center items-center transition-opacity duration-300
                ${isShowQuickViewProduct ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
            <div
                ref={QVPRef}
                className={`min-w-1/2 min-h-40 max-h-130 overflow-auto bg-white rounded-xl border 
                    border-gray-200 p-6 transition-all duration-300 transform
                    ${isShowQuickViewProduct ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
            >
                <div className="w-full flex flex-shrink-0 items-start justify-between gap-2">
                    <div className="w-[500px] space-y-3">
                        <div 
                            className="relative w-full h-[500px] rounded-xl 
                                overflow-hidden border border-gray-200 bg-gray-50">
                            <Image
                                src={selectedProductDetails?.product_images[currentImage] || ""}
                                alt=""
                                fill
                                className="object-cover"
                                loading="lazy"
                                quality={100}
                            />
                        </div>
                        <div className="w-full grid grid-cols-4 gap-2">
                            {selectedProductDetails?.product_images.map((pic, idx) => (
                                <button
                                    key={idx}
                                    disabled={currentImage === idx}
                                    onClick={() => setCurrentImage(idx)}
                                    className={`relative w-full h-20 rounded-xl 
                                        flex-shrink-0 overflow-hidden bg-gray-200
                                        transition-all duration-300 border border-gray-200
                                        ${currentImage === idx ? "ring-4 ring-teal-600" : "hover:ring-2 ring-gray-400 cursor-pointer"}`}
                                >
                                    <Image
                                        src={pic || ""}
                                        alt=""
                                        fill
                                        className="object-cover"
                                        loading="lazy"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div 
                        className="w-[400px] min-h-40 border border-gray-200 
                            p-3 rounded-xl space-y-4">
                        <div className="flex items-center gap-2">
                            <div 
                                className="relative border border-gray-200 
                                    w-10 h-10 rounded-full flex-shrink-0
                                    overflow-hidden ring-2 ring-teal-600">
                                <Image
                                    src={selectedProductDetails?.owner?.image || ""}
                                    alt={selectedProductDetails?.owner?.name || ""}
                                    fill
                                    className="object-cover"
                                    quality={100}
                                    loading="lazy"
                                />
                            </div>
                            <span>
                                <h1 className="flex items-center gap-1">
                                    {selectedProductDetails?.owner?.name} <BadgeCheck className="text-teal-600" size={14} />
                                </h1>
                                <p className="text-gray-400 flex items-center gap-1 text-sm">
                                    <Star size={12} className="fill-yellow-500 text-yellow-500" />
                                    4.8 ● 234 reviews
                                </p>
                            </span>
                        </div>
                        <h1
                            className="text-2xl font-semibold"
                        >
                            {selectedProductDetails?.title}
                        </h1>
                        <div
                            className="flex items-center justify-between"
                        >
                            <span
                                className="flex items-end gap-3"
                            >
                                <ins
                                    className="no-underline text-xl text-gray-600"
                                >
                                    {selectedProductDetails?.sale_price} Dh
                                </ins>
                                <del
                                    className="text-gray-400 text-sm"
                                >
                                    {selectedProductDetails?.regular_price} Dh
                                </del>
                            </span>
                            <p
                                className="text-sm uppercase text-teal-600 px-3"
                            >
                                {CalculateDiscount(selectedProductDetails?.sale_price, selectedProductDetails?.regular_price)}% off
                            </p>
                        </div>
                        <div
                            className="flex items-center gap-6"
                        >
                            <span
                                className="flex items-center"
                            >
                                {Array(5).fill(0).map((_, idx) => {
                                    if(!selectedProductDetails?.rating) return;
                                    return (
                                        <Star
                                            key={idx}
                                            size={16}
                                            className={`
                                                ${idx < selectedProductDetails?.rating ? "fill-yellow-500 text-yellow-500" : "text-yellow-500"}
                                            `}
                                        />
                                    )
                                })}
                            </span>
                            <span
                                className="text-gray-400"
                            >
                                {selectedProductDetails?.rating} ({selectedProductDetails?.reviewCount} reviews)
                            </span>
                        </div>
                        <div
                            className="space-y-1"
                        >
                            <h1
                                className="text-lg"
                            >
                                Description
                            </h1>
                            <p
                                className="text-sm text-gray-500"
                            >
                                {selectedProductDetails?.description}
                            </p>
                        </div>
                        <div>
                            <h1
                                className="text-lg"
                            >
                                Tags
                            </h1>
                            <div
                                className="flex items-center gap-3 py-3"
                            >
                                {selectedProductDetails?.colors.map((col, idx) => {
                                    const selectedcol = selectedColor === "" ? selectedProductDetails?.colors[0].color : selectedColor;
                                    return (
                                        <span 
                                            key={idx}
                                            onClick={() => setSelectedColor(col.color)}
                                            style={{ backgroundColor: col.color }}
                                            className={`flex transition-all duration-200 
                                                w-6 h-6 rounded-full
                                                ${selectedcol === col.color ? "ring-2 border border-gray-200 ring-teal-600" : "cursor-pointer"}`}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                        <div>
                            <h1
                                className="text-lg"
                            >
                                Quantity
                            </h1>
                            <div
                                className="flex gap-3 items-center text-lg py-3"
                            >
                                <button
                                    className="px-6 bg-gray-50 border 
                                        border-transparent cursor-pointer 
                                        hover:border-gray-200 rounded-lg 
                                        transition-all duration-200 text-xl"
                                >-</button>
                                <span>1</span>
                                <button
                                    className="px-6 bg-gray-50 border 
                                        border-transparent cursor-pointer 
                                        hover:border-gray-200 rounded-lg 
                                        transition-all duration-200 text-xl"
                                >+</button>
                            </div>
                        </div>
                        <div
                            className="w-full flex items-center gap-2"
                        >
                            <button
                                className="w-full flex justify-center items-center gap-1
                                    border-b-2 border-gray-300 cursor-pointer rounded-xl py-1
                                    bg-gradient-to-r from-teal-600 to-teal-500 text-white
                                    hover:from-teal-500 hover:to-teal-600 transition-colors duration-200"
                            >
                                <ShoppingCart size={16} /> Add to Cart
                            </button>
                            <button
                                className="w-full flex justify-center items-center gap-1
                                    border-b-2 border-gray-300 rounded-xl py-1 cursor-pointer
                                    bg-gradient-to-r from-black to-black/80 text-white
                                    hover:from-black/80 hover:to-black transition-colors duration-200"
                            >
                                <Heart size={16} /> Add to Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}