"use client";

import { ProductType } from "@/types/product";
import { Heart, BarChart3, Users, Package, Trash2, Droplet, AlertTriangle, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuickViewProduct } from "@/context/QuickViewProductContext";
import { toast } from "sonner";
import { useUserInfos } from "@/context/UserInfosContext";

// The ConfirmationModal component remains unchanged.
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  title: string;
  description: string;
}
export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  title,
  description,
}: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm text-gray-600">{description}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-red-300"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete Product
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ✅ FIX: Re-added the `isFavorite` prop to receive the initial state from the parent.
interface ProductCardUIProps {
    product: ProductType;
    isAffiliate: boolean;
    onClaimClick: (product: ProductType) => void;
    onDeleteClick: (product: ProductType) => void;
}

export function ProductCardUI({ product, isAffiliate, onClaimClick, onDeleteClick }: ProductCardUIProps) {
    // ✅ FIX: The refetch function is destructured to update the global user state.
    const { refetch: refetchUserInfos, userInfos } = useUserInfos();
    
    // ✅ FIX: The local favorite state is now initialized from the `isFavorite` prop.
    const [isFav, setIsFav] = useState(userInfos?.favoriteProductIds.includes(product.id));
    const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
    const { data: session } = useSession();
    const { setProductID, setIsShowQuickViewProduct } = useQuickViewProduct();

    // ✅ FIX: This effect ensures the card's heart icon updates if the prop changes from the parent.
    // This is important for when the global user info is refetched.

    const HandleShowQuickViewProduct = (ProductId: string) => {
        setIsShowQuickViewProduct(true);
        setProductID(ProductId);
    }
    
    const [imageIndex, setImageIndex] = useState(0);
    const images = product.product_images || [];
    const hasMultipleImages = images.length > 1;

    if (session === undefined) return null;
    
    const isOwner = product.owner?.email === session?.user?.email;

    const handleToggleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();

        if (isTogglingFavorite) return;
        if (!session) {
            toast.error("Please sign in to add products to your favorites.");
            return;
        }

        const originalIsFav = isFav;
        setIsTogglingFavorite(true);
        setIsFav(!originalIsFav); // Optimistic UI update

        try {
            const response = await fetch('/api/products/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: product.id }),
            });

            if (!response.ok) {
                setIsFav(originalIsFav); // Revert on API error
                toast.error("Failed to update favorites. Please try again.");
            } else {
                // ✅ FIX: On success, refetch the global user info to sync the state everywhere.
                refetchUserInfos();
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
            setIsFav(originalIsFav); // Revert on network error
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsTogglingFavorite(false);
        }
    };

    const goToNextImage = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();
        setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const goToPrevImage = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();
        setImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const affiliateCount = Math.floor((product.sales || 0) / 5) + 5;

    return (
        <motion.div
            initial="rest"
            whileHover="hover"
            animate="rest"
            className="group relative flex flex-col w-full bg-white 
                rounded-lg overflow-hidden border-b border-neutral-200 
                hover:border-neutral-400 ring ring-neutral-200
                hover:ring-neutral-300 transition-all duration-300"
        >
            <div className="relative w-full h-52 overflow-hidden">
                <AnimatePresence initial={false}>
                    <motion.div
                        key={imageIndex}
                        className="w-full h-full"
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <Image
                            src={images[imageIndex] || "/placeholder.svg"}
                            alt={`${product.title} image ${imageIndex + 1}`}
                            fill
                            onClick={() => HandleShowQuickViewProduct(product.id)}
                            className="object-cover cursor-pointer"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </motion.div>
                </AnimatePresence>

                {hasMultipleImages && (
                    <>
                        <motion.button
                            onClick={goToPrevImage}
                            className="absolute top-1/2 left-2 z-20 cursor-pointer -translate-y-1/2 p-1.5 bg-white/60 backdrop-blur-sm rounded-full text-neutral-700 hover:bg-white transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                            aria-label="Previous Image"
                        >
                            <ChevronLeft size={20} />
                        </motion.button>
                        <motion.button
                            onClick={goToNextImage}
                            className="absolute top-1/2 right-2 z-20 cursor-pointer -translate-y-1/2 p-1.5 bg-white/60 backdrop-blur-sm rounded-full text-neutral-700 hover:bg-white transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                            aria-label="Next Image"
                        >
                            <ChevronRight size={20} />
                        </motion.button>
                    </>
                )}
                
                {hasMultipleImages && (
                    <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center items-center gap-1.5">
                        {images.map((_, index) => (
                            <div
                                key={`dot-${index}`}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    index === imageIndex ? 'w-4 bg-white shadow' : 'w-1.5 bg-white/50'
                                }`}
                            />
                        ))}
                    </div>
                )}
                
                <div className="absolute top-3 right-3 z-30 flex flex-col gap-2">
                    <motion.button 
                        whileTap={{ scale: 0.9 }} 
                        onClick={handleToggleFavorite} 
                        disabled={isTogglingFavorite}
                        className="p-2 bg-white/60 backdrop-blur-sm rounded-full text-neutral-600 hover:text-red-500 transition-colors disabled:cursor-not-allowed disabled:opacity-50" 
                        aria-label="Toggle Favorite"
                    >
                        <Heart 
                            size={20} 
                            className={isFav ? "cursor-pointer text-red-500 fill-red-500"
                            :
                            "text-red-500 cursor-pointer"} />
                    </motion.button>
                    
                    {isOwner && (
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteClick(product);
                            }}
                            className="p-2 bg-white/60 backdrop-blur-sm rounded-full text-neutral-600 hover:bg-red-600 hover:text-white transition-all duration-200"
                            aria-label="Delete Product"
                        >
                            <Trash2 size={20} />
                        </motion.button>
                    )}
                </div>
            </div>

            <div className="flex flex-col p-4">
                 <h3
                    onClick={() => HandleShowQuickViewProduct(product.id)} 
                    className="font-semibold text-neutral-700 leading-tight 
                        truncate mb-2 cursor-pointer w-max"
                    title={product.title}
                >
                    {product.title}
                </h3>
                <div className="flex items-baseline gap-2 mb-3">
                    <p className="text-xl font-bold text-neutral-900">{product.original_sale_price.toFixed(2)} Dh</p>
                    {product.original_regular_price > product.original_sale_price && (
                        <p className="text-sm text-neutral-400 line-through">{product.original_regular_price.toFixed(2)} Dh</p>
                    )}
                </div>
                <div className="flex items-center justify-between text-sm text-neutral-500 border-t border-neutral-200/80 pt-3">
                    <div 
                        className="flex flex-col items-center text-xs" 
                        title={`${product.sales || 0} sales`}
                    >
                        <span className="flex items-end gap-1">
                            <BarChart3 size={18} className="text-neutral-400" />
                            {product.sales || 0}
                        </span>
                        sales
                    </div>
                    <div 
                        className="flex flex-col items-center text-xs" 
                        title={`${affiliateCount} affiliates`}>
                        <span className="flex items-end gap-1">
                            <Users size={18} className="text-neutral-400" />
                            {affiliateCount}
                        </span>
                        affiliate
                    </div>
                    <div 
                        className="flex flex-col items-center text-xs" 
                        title={`${product.stock} in stock`}>
                        <span className="flex items-end gap-1">
                            <Package size={18} className="text-neutral-400" />
                            {product.stock}
                        </span>
                        stock
                    </div>
                </div>
            </div>
            
            {isAffiliate && (
                 <div className="max-h-0 group-hover:max-h-40 cursor-pointer overflow-hidden transition-all duration-300 ease-in-out">
                    <div className="px-4 pb-4">
                         <motion.button 
                            onClick={(e) => { e.stopPropagation();
                                onClaimClick(product);
                            }} 
                            whileTap={{ scale: 0.98 }} 
                            className="w-full flex items-center justify-center 
                                gap-2 px-4 py-2.5 rounded-md bg-neutral-800 
                                text-white font-semibold text-sm transition-colors 
                                duration-200 hover:bg-black focus:outline-none 
                                focus:ring-2 focus:ring-offset-2 
                                cursor-pointer focus:ring-neutral-700">
                            <Droplet size={16} /> Drop To Collection
                        </motion.button>
                    </div>
                </div>
            )}
        </motion.div>
    );
}