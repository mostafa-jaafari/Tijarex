"use client";

import { Check, Star, ShieldCheck } from "lucide-react";
import { AffiliateProductType, ProductType } from "@/types/product";
import { AddToCartButton } from "@/components/UI/Add-To-Cart/AddToCartButton";
import { QuantitySelector } from "@/components/UI/Add-To-Cart/QuantitySelector";
import { useState, useEffect } from "react";

// --- Type guard to safely differentiate between product types ---
function isAffiliateProduct(
  product: ProductType | AffiliateProductType
): product is AffiliateProductType {
  // Check for a property unique to AffiliateProductType
  return "AffiliateTitle" in product;
}

// --- Define props for the component for strict typing ---
type ProductDetailsClientProps = {
  product: ProductType | AffiliateProductType;
};

// --- Client Component for all interactive product details ---
export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  // --- State for user selections ---
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // --- Common properties available on both types ---
  const title = isAffiliateProduct(product) ? product.AffiliateTitle : product.title;
  const description = isAffiliateProduct(product) ? product.AffiliateDescription : product.description;
  const salePrice = isAffiliateProduct(product) ? product.AffiliateSalePrice : product.original_sale_price;
  const regularPrice = isAffiliateProduct(product) ? product.AffiliateRegularPrice : product.original_regular_price;
  const isOnSale = regularPrice && salePrice < regularPrice;

  // --- Effect to set default color/size on load only for standard products ---
  useEffect(() => {
    // This effect should only run for standard products that have selectable options
    if (!isAffiliateProduct(product)) {
      if (product.colors && product.colors.length > 0 && !selectedColor) {
        setSelectedColor(product.colors[0]);
      }
      if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        setSelectedSize(product.sizes[0]);
      }
    }
  }, [product, selectedColor, selectedSize]);

  const highlights = [
    "Crafted with premium materials",
    "Designed for modern aesthetics",
    "Eco-friendly packaging",
    "Durable and built to last",
  ];

  return (
    <div className="mt-8 lg:col-span-5 lg:mt-0">
      {/* --- Section 1: Header (Title, Price, Reviews) --- */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          {title}
        </h1>
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold tracking-tight text-gray-900">
            {salePrice.toFixed(2)} dh
            {isOnSale && (
              <span className="ml-3 text-xl font-medium text-gray-400 line-through">
                {regularPrice.toFixed(2)} dh
              </span>
            )}
          </p>
          {/* Reviews only show for standard products */}
          {!isAffiliateProduct(product) && (
            <div className="flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 flex-shrink-0 ${product.rating > i ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} aria-hidden="true" />
                ))}
              </div>
              <a href="#reviews" className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                ({product.reviews?.length || 0} reviews)
              </a>
            </div>
          )}
        </div>
      </div>

      <hr className="my-6 border-gray-200" />

      {/* --- Section 2: Description, Options, and Actions --- */}
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-800">Description</h3>
          <p className="mt-2 text-base text-gray-600">{description}</p>
        </div>

        {/* Stock status is common */}
        <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          <span className={`h-2 w-2 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
          {product.stock > 0 ? `${product.stock} In Stock` : "Out of Stock"}
        </div>

        {/* --- INTERACTIVE SECTION: Renders only for standard products --- */}
        {!isAffiliateProduct(product) && (
          <>
            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-800">
                  Color: <span className="font-normal text-gray-600">{selectedColor}</span>
                </h3>
                <div className="flex items-center gap-3">
                  {product.colors.map((col) => (
                    <button 
                        key={col} 
                        onClick={() => setSelectedColor(col)} 
                        disabled={selectedColor === col}
                        style={{ backgroundColor: col }} 
                        className={`w-8 h-8 rounded-full border border-neutral-300 
                            transition-all duration-200 flex items-center 
                            justify-center 
                            ${selectedColor === col ?
                                "ring-2 border-neutral-200 ring-offset-2 ring-teal-600"
                                :
                                "hover:border-gray-400 cursor-pointer"}
                            `}
                    >
                      {selectedColor === col && 
                        <Check 
                            size={16} 
                            className={col.toLowerCase() !== "white" ? "text-neutral-100" : "text-neutral-700"} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-800">
                    Size: <span className="font-normal text-gray-600">{selectedSize}</span>
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  {product.sizes.map((size) => (
                    <button 
                        key={size} 
                        onClick={() => setSelectedSize(size)} 
                        className={`rounded-lg border-b border-neutral-400 ring ring-neutral-200
                            px-4 py-2 text-sm font-medium transition-colors duration-200 
                            ${selectedSize === size ?
                                "bg-teal-600 text-white border-teal-700"
                                :
                                "bg-white text-neutral-700 cursor-pointer border-gray-300 hover:bg-gray-50"}
                        `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Add to Cart Section */}
            <div className="mt-6 flex w-full items-stretch gap-3 pt-4">
                <QuantitySelector
                    quantity={quantity} 
                    setQuantity={setQuantity} 
                    stock={product.stock}
                />
              <div className="flex-grow">
                <AddToCartButton
                    isCustomerSide={false}
                    productId={product.id} // Correctly uses _id
                    quantity={quantity}
                    stock={product.stock}
                    availableColors={product.colors || []}
                    selectedColor={selectedColor}
                    availableSizes={product.sizes || []}
                    selectedSize={selectedSize}
                />
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* --- Section 3: Details & Guarantees (Common to all) --- */}
      <section aria-labelledby="details-heading" className="mt-10">
        <div className="divide-y divide-gray-200 border-t border-gray-200">
          <div className="py-6">
            <h3 className="text-base font-medium text-gray-900">Product Highlights</h3>
            <ul className="mt-4 space-y-3">
              {highlights.map((highlight) => (
                <li key={highlight} className="flex items-center text-sm text-gray-600">
                  <Check className="mr-3 h-5 w-5 flex-shrink-0 text-green-500" aria-hidden="true" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="py-6">
            <h3 className="text-base font-medium text-gray-900">Our Guarantee</h3>
            <div className="flex items-center mt-4 text-sm text-gray-600">
              <ShieldCheck className="mr-3 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />
              <span>Secure payments & 30-day money-back guarantee.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}