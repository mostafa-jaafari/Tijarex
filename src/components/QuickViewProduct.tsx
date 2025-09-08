"use client";
import { useQuickViewProduct } from "@/context/QuickViewProductContext";
import { useUserInfos } from "@/context/UserInfosContext";
import { AffiliateProductType, ProductType } from "@/types/product";
import { BadgeCheck, Heart, Star, X, Check, Copy } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { HandleGetRefLink } from "./Functions/GetAffiliateLink";
import { useFirstAffiliateLink } from "@/context/FirstAffiliateLinkContext";
import { useParams } from "next/navigation";
import { QuantitySelector } from "./UI/Add-To-Cart/QuantitySelector";
import { AddToCartButton } from "./UI/Add-To-Cart/AddToCartButton";

// Helper function
const CalculateDiscount = (salePrice?: number, regularPrice?: number) => {
  if (!salePrice || !regularPrice || regularPrice <= salePrice) return 0;
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
};

// Type Guard
function isAffiliateProduct(
  product: ProductType | AffiliateProductType
): product is AffiliateProductType {
  return (product as AffiliateProductType).AffiliateTitle !== undefined;
}

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

export function QuickViewProduct() {
  const { userInfos } = useUserInfos();
  const { hasGottenFirstLink, markAsGotten } = useFirstAffiliateLink();
  const { isShowQuickViewProduct, setIsShowQuickViewProduct, productID } = useQuickViewProduct();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState<ProductType | AffiliateProductType | null>(null);
  const SunPagesId = useParams().subpagesid;
  // States for UI interaction
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Fetch product details when the modal is opened
  useEffect(() => {
    const handleFetchProductDetails = async () => {
      if (!productID) return;

      setIsLoading(true);
      setSelectedProductDetails(null); 
      
      try {
        // --- THIS IS THE FIX ---
        // Call your new, unified API endpoint.
        const response = await fetch(`/api/products/${productID}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Product not found.`);
        }

        const { product } = await response.json();
        
        setSelectedProductDetails(product || null);

        if (product) {
          if ("colors" in product && product.colors && product.colors.length > 0) {
            setSelectedColor(product.colors[0]);
          } else if ("sizes" in product && product.sizes && product.sizes.length > 0) {
            setSelectedSize(product.sizes[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch product details:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isShowQuickViewProduct) {
        handleFetchProductDetails();
    }
  }, [productID, isShowQuickViewProduct]);

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
      setSelectedSize(null);
    }
  }, [isShowQuickViewProduct]);

  if (!isShowQuickViewProduct) return null;

  const productImages = selectedProductDetails?.product_images || [];
  const productColors = "colors" in (selectedProductDetails || {}) ? selectedProductDetails?.colors || [] : [];
  const productSizes = "sizes" in (selectedProductDetails || {}) ? selectedProductDetails?.sizes || [] : [];

  return (
    <section
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm 
                flex justify-center items-center p-4 transition-opacity 
                duration-300"
    >
      <div
        ref={modalRef}
        className={`relative w-full max-w-4xl max-h-[80vh] bg-white rounded-xl shadow-2xl p-6 md:p-8 overflow-y-auto transition-all duration-300 ${
          isShowQuickViewProduct ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsShowQuickViewProduct(false)}
          className="absolute top-4 right-4 cursor-pointer 
                        text-gray-400 hover:text-gray-800 
                        transition-colors z-10"
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
                  alt={isAffiliateProduct(selectedProductDetails) ? selectedProductDetails.AffiliateTitle : selectedProductDetails.title}
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
                      currentImageIndex === idx
                        ? "border-b-2 cursor-pointer shadow-[0_4px_6px_-1px_rgba(0,0,0,0.4)] border-purple-700 ring-2 ring-purple-500"
                        : "border-b-2 cursor-pointer shadow-[0_4px_6px_-1px_rgba(0,0,0,0.4)] border-neutral-600 ring-2 ring-neutral-300"
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
                <h1 className="text-3xl font-bold text-gray-900">
                  {isAffiliateProduct(selectedProductDetails)
                    ? selectedProductDetails.AffiliateTitle
                    : selectedProductDetails.title}
                </h1>
                {userInfos && (userInfos?.UserRole === "seller" || userInfos?.UserRole === "affiliate") && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <span>Sold by:</span>
                    <span className="font-semibold text-purple-600 flex items-center gap-1">
                      {selectedProductDetails.owner?.name} <BadgeCheck size={16} className="text-purple-600" />
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-baseline gap-2">
                  <ins className="text-2xl font-bold text-gray-800 no-underline">
                    {isAffiliateProduct(selectedProductDetails)
                      ? selectedProductDetails.AffiliateSalePrice
                      : selectedProductDetails.original_sale_price}{" "}
                    {selectedProductDetails.currency}
                  </ins>
                  <del className="text-gray-400">
                    {isAffiliateProduct(selectedProductDetails)
                      ? selectedProductDetails.AffiliateRegularPrice
                      : selectedProductDetails.original_regular_price}{" "}
                    {selectedProductDetails.currency}
                  </del>
                </div>
                <div className="text-sm font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                  {isAffiliateProduct(selectedProductDetails)
                    ? CalculateDiscount(selectedProductDetails.AffiliateSalePrice, selectedProductDetails.AffiliateRegularPrice)
                    : CalculateDiscount(selectedProductDetails.original_sale_price, selectedProductDetails.original_regular_price)}
                  % OFF
                </div>
              </div>

              {!isAffiliateProduct(selectedProductDetails) && (
                <div className="flex items-center gap-3 text-sm border-b border-neutral-200 pb-4">
                  <div className="flex items-center text-yellow-500">
                    {Array(5)
                      .fill(0)
                      .map((_, idx) => (
                        <Star
                          key={idx}
                          size={16}
                          className={
                            idx < (selectedProductDetails.rating || 0) ? "fill-current" : "text-yellow-500"
                          }
                        />
                      ))}
                  </div>
                  <span className="text-gray-500">
                    {selectedProductDetails.rating?.toFixed(1)} (
                    {selectedProductDetails.reviews?.length || 0} reviews)
                  </span>
                </div>
              )}

              <p className="text-sm text-gray-600 leading-relaxed">
                {isAffiliateProduct(selectedProductDetails)
                  ? selectedProductDetails.AffiliateDescription
                  : selectedProductDetails.description}
              </p>

              {productColors.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-800">
                    Color: <span className="font-normal text-gray-600">{selectedColor}</span>
                  </h3>
                  <div className="flex items-center gap-3">
                    {productColors.map((col) => (
                      <button
                        key={col}
                        onClick={() => setSelectedColor(col)}
                        style={{ backgroundColor: col }}
                        className={`w-8 h-8 rounded-full border border-neutral-300 transition-all 
                          duration-200 flex items-center justify-center
                          ${
                            selectedColor === col
                              ? "ring-2 ring-offset-2 ring-purple-600 border-white"
                              : "hover:border-gray-300 cursor-pointer"
                        }`}
                      >
                        {selectedColor === col && <Check size={16} className="text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {productSizes.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-800">
                    Sizes: <span className="font-normal text-gray-600">{selectedSize}</span>
                  </h3>
                  <div className="flex items-center gap-3">
                    {productSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`rounded-lg border 
                          w-10 h-10 border-neutral-300 transition-all 
                          duration-200 flex items-center justify-center
                          ${
                            selectedSize?.toLowerCase() === size.toLowerCase()
                              ? "bg-purple-700 text-neutral-200"
                              : "bg-neutral-50 cursor-pointer"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-4">
                {(userInfos?.UserRole !== "affiliate" && userInfos?.UserRole !== "seller") ? (
                  <div className="flex items-center gap-4 mt-auto">
                    {/* 1. Replace the old quantity buttons with the new component */}
                    <QuantitySelector
                      quantity={quantity}
                      setQuantity={setQuantity}
                      stock={selectedProductDetails.stock}
                    />
                    
                    {/* 2. Replace the old button with the new component */}
                    <AddToCartButton
                      productId={selectedProductDetails.id}
                      quantity={quantity}
                      stock={selectedProductDetails.stock}
                      availableColors={productColors}
                      selectedColor={selectedColor}
                      availableSizes={productSizes}
                      selectedSize={selectedSize}
                    />
                  </div>
                )
                :
                (SunPagesId !== "products" && SunPagesId !== "favorites" && userInfos.UserRole !== "seller") &&
                (
                  <button
                    onClick={() =>
                      HandleGetRefLink(
                        selectedProductDetails.id,
                        userInfos.uniqueuserid,
                        hasGottenFirstLink,
                        markAsGotten
                      )
                    }
                    className="w-full py-2.5 rounded-lg bg-neutral-800
                      hover:bg-neutral-900 cursor-pointer
                      text-neutral-200 border-b border-neutral-400 purple-400 
                      shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2)]
                      ring ring-neutral-400 text-sm
                      flex items-center gap-2 justify-center"
                  >
                    Get Link <Copy size={18} />
                  </button>
                )}

                <button
                    className={`w-full flex items-center justify-center 
                        gap-2 cursor-pointer text-purple-100
                        hover:border-purple-500 text-sm
                        border-b border-purple-900 ring ring-purple-600
                        py-2 rounded-lg bg-purple-700 hover:bg-purple-800
                        transition-all duration-200
                        shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2)]
                    `}
                >
                  <Heart size={18} /> Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
