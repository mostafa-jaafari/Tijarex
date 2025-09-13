"use client";

import { ProductType } from "@/types/product";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

interface ProductCardUIProps {
    product: ProductType;
    isAffiliate: boolean;
    isFavorite: boolean;
    onClaimClick: (product: ProductType) => void;
}

export function ProductCardUI({ product, isAffiliate, isFavorite, onClaimClick }: ProductCardUIProps) {
    // Local state to provide immediate feedback on favorite toggle
    const [isFav, setIsFav] = useState(isFavorite);

    const handleToggleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
        // Prevent the card's link from firing when clicking the button
        e.stopPropagation();
        e.preventDefault();

        // Immediately update UI for better user experience
        setIsFav(!isFav);

        // --- Add your API call logic here to update the backend ---
        // For example:
        // await fetch(`/api/products/favorites/${product.id}`, {
        //     method: 'POST',
        //     body: JSON.stringify({ isFavorite: !isFav }),
        // });
        console.log(`Toggled favorite for product: ${product.id}`);
    };

    // Animation variants for Framer Motion
    const cardVariants = {
        rest: { scale: 1, y: 0, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)" },
        hover: { 
            scale: 1.03, 
            y: -5,
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)"
        },
    };

    const imageVariants = {
        rest: { scale: 1 },
        hover: { scale: 1.1 },
    }

    return (
        <motion.div
            variants={cardVariants}
            initial="rest"
            whileHover="hover"
            animate="rest"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="group relative flex flex-col w-full bg-white rounded-xl overflow-hidden cursor-pointer border border-neutral-200"
        >
            {/* Image Container with Hover Effect */}
            <div className="relative w-full h-56 overflow-hidden">
                <motion.div variants={imageVariants} transition={{ duration: 0.3, ease: "easeInOut" }}>
                    <Image
                        src={product.product_images[0] || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </motion.div>
                
                {/* Favorite Button */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleToggleFavorite}
                    className="absolute top-3 right-3 z-10 p-2 bg-white/70 backdrop-blur-sm rounded-full text-neutral-600 hover:text-red-500 transition-colors duration-300"
                    aria-label="Toggle Favorite"
                >
                    <Heart size={20} fill={isFav ? "#ef4444" : "none"} className={isFav ? "text-red-500" : ""} />
                </motion.button>
            </div>

            {/* Product Information */}
            <div className="flex flex-col p-4 flex-grow">
                <p className="text-xs text-neutral-500 mb-1">{product.category}</p>
                <h3 className="font-semibold text-neutral-800 leading-tight truncate mb-2" title={product.title}>
                    {product.title}
                </h3>

                <div className="mt-auto">
                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-3">
                        <p className="text-xl font-bold text-neutral-900">
                            Dh{product.original_sale_price.toFixed(2)}
                        </p>
                        {product.original_regular_price > product.original_sale_price && (
                            <p className="text-sm text-neutral-400 line-through">
                                Dh{product.original_regular_price.toFixed(2)}
                            </p>
                        )}
                    </div>

                    {/* Action Button */}
                    {isAffiliate && (
                         <motion.button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClaimClick(product);
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-800 text-white font-semibold text-sm transition-colors duration-300 hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-700"
                        >
                            <ShoppingCart size={16} />
                            Claim Product
                        </motion.button>
                    )}
                </div>
            </div>
                    {product.id}
            {/* Optional: Add a subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
    );
}