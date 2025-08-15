"use client";

import { useQuickViewProduct } from "@/context/QuickViewProductContext";
import { ProductType } from "@/types/product";
import { BadgeCheck, Star } from "lucide-react";
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
                    <div className="w-[400px] space-y-3">
                        <div 
                            className="relative w-full h-[400px] rounded-xl 
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
                            p-3 rounded-xl space-y-3">
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
                            {selectedProductDetails?.name}
                        </h1>
                        <span
                            className="flex items-end gap-3"
                        >
                            <ins
                                className="no-underline text-xl text-gray-600"
                            >
                                {selectedProductDetails?.sale_price} Dh
                            </ins>
                            <del
                                className="text-gray-400 text-md"
                            >
                                {selectedProductDetails?.regular_price} Dh
                            </del>
                            <p
                                className="text-teal-600 px-3"
                            >
                                {CalculateDiscount(selectedProductDetails?.sale_price, selectedProductDetails?.regular_price)}% off
                            </p>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}