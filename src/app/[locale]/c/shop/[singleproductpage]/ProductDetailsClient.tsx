"use client";

import { Check, Star, ShieldCheck } from "lucide-react";
import { ProductType } from "@/types/product"; // We only need the main ProductType now
import { AddToCartButton } from "@/components/UI/Add-To-Cart/AddToCartButton";
import { QuantitySelector } from "@/components/UI/Add-To-Cart/QuantitySelector";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from 'framer-motion';

// --- Child Component for Information Tabs ---
type ProductInfoTabsProps = {
  description: string;
  highlights: string[];
};

function ProductInfoTabs({ description, highlights }: ProductInfoTabsProps) {
  const tabs = [
    { id: 'description', label: 'Description', content: (
        <div>
          <h3 className="text-lg font-semibold text-neutral-800">Description</h3>
          <p className="my-4 text-sm text-neutral-600 leading-relaxed prose">{description}</p>
        </div>
    )},
    { id: 'highlights', label: 'Highlights', content: (
        <div>
          <h3 className="text-lg font-semibold text-neutral-800">Product Highlights</h3>
          <ul className="my-4 space-y-3">
            {highlights.map((highlight) => (
              <li key={highlight} className="flex items-center text-sm text-neutral-600">
                <Check className="mr-3 h-5 w-5 flex-shrink-0 text-teal-500" aria-hidden="true" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
    )},
  ];

  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const contentVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="w-full">
      <nav>
        <div role="tablist" aria-label="Product Information" className="flex border-b border-neutral-200">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id} role="tab" aria-selected={selectedTab.id === tab.id}
              aria-controls={`tabpanel-${tab.id}`} id={`tab-${tab.id}`}
              className={`relative w-full py-3 px-4 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
                selectedTab.id === tab.id ? 'text-teal-600' : 'text-neutral-500 hover:text-neutral-800'
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab.label}
              {selectedTab.id === tab.id && (
                <motion.div
                  className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-teal-600"
                  layoutId="underline"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </nav>
      <main className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab.id} id={`tabpanel-${selectedTab.id}`} role="tabpanel"
            aria-labelledby={`tab-${selectedTab.id}`} variants={contentVariants}
            initial="initial" animate="animate" exit="exit"
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {selectedTab.content}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- Define props for the component for strict typing ---
type ProductDetailsClientProps = {
  // ⭐️ FIX: The component now only needs to accept the base ProductType.
  product: ProductType;
};

// --- Main Client Component ---
export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  // --- State for user selections ---
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // ⭐️ FIX: New, simpler logic to determine if this is an affiliate's view.
  const isAffiliateView = product.AffiliateInfos && product.AffiliateInfos.AffiliateInfo;
  
  // --- Extract data based on whether it's an affiliate view or not ---
  const title = isAffiliateView ? product.AffiliateInfos?.AffiliateInfo!.AffiliateTitle : product.title;
  const description = isAffiliateView ? product.AffiliateInfos?.AffiliateInfo!.AffiliateDescription : product.description;
  const salePrice = isAffiliateView ? product.AffiliateInfos?.AffiliateInfo!.AffiliateSalePrice : product.original_sale_price;
  const regularPrice = isAffiliateView ? product.AffiliateInfos?.AffiliateInfo!.AffiliateRegularPrice : product.original_regular_price;
  
  // --- These properties ALWAYS come from the base product object ---
  const { stock, reviews, colors, sizes, highlights, id: productId } = product;
  
  const isOnSale = (salePrice) && regularPrice && salePrice < regularPrice;

  // --- Effect to set default color/size on load only for standard (non-affiliate) products ---
  useEffect(() => {
    // This effect should only run for standard products that have selectable options.
    if (!isAffiliateView) {
      if (colors && colors.length > 0 && !selectedColor) {
        setSelectedColor(colors[0]);
      }
      if (sizes && sizes.length > 0 && !selectedSize) {
        setSelectedSize(sizes[0]);
      }
    }
  }, [isAffiliateView, colors, sizes, selectedColor, selectedSize]);

  const averageRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviews.length;
  }, [reviews]);

  return (
    <div className="mt-8 lg:col-span-5 lg:mt-0">
      {/* --- Section 1: Header (Title, Price, Reviews) --- */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
          {title}
        </h1>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold tracking-tight text-neutral-900">
            {isOnSale && (
              <span className="mr-3 text-lg font-medium text-neutral-400 line-through">
                {regularPrice.toFixed(2)} dh
              </span>
            )}
            {salePrice?.toFixed(2)} dh
          </p>
          {/* Reviews are always from the base product, but we only show them in the standard view. */}
          {!isAffiliateView && (
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 flex-shrink-0 ${averageRating > i ? "text-yellow-400 fill-yellow-400" : "text-neutral-300"}`} aria-hidden="true" />
                ))}
              </div>
              <a href="#reviews" className="text-sm text-neutral-500 hover:text-neutral-400">
                ({reviews?.length || 0} reviews)
              </a>
            </div>
          )}
        </div>
      </div>

      <hr className="my-6 border-neutral-200" />

      {/* --- Section 2: Description, Options, and Actions --- */}
      <div className="space-y-6">
        <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          <span className={`h-2 w-2 rounded-full ${stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
          {stock > 0 ? `${stock} In Stock` : "Out of Stock"}
        </div>

        {/* --- INTERACTIVE SECTION: Renders only for standard (non-affiliate) products --- */}
        {!isAffiliateView && (
          <>
            {/* Color Selector */}
            {colors && colors.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-neutral-800">
                  Color : <span className="font-normal text-neutral-600">{selectedColor}</span>
                </h3>
                <div className="flex items-center gap-3">
                  {colors.map((col) => (
                    <button 
                        key={col} onClick={() => setSelectedColor(col)}
                        style={{ backgroundColor: col }} 
                        className={`w-8 h-8 rounded-full border border-neutral-300 transition-all duration-200 flex items-center justify-center ${selectedColor === col ? "ring-2 border-neutral-200 ring-offset-2 ring-teal-600" : "hover:border-neutral-400"}`}
                    >
                      {selectedColor === col && <Check size={16} className={col.toLowerCase() !== "white" ? "text-neutral-100" : "text-neutral-700"} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {sizes && sizes.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-neutral-800">
                    Size : <span className="font-normal text-neutral-600">{selectedSize}</span>
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  {sizes.map((size) => (
                    <button 
                        key={size} onClick={() => setSelectedSize(size)} 
                        className={`rounded-lg border-b border-neutral-400 ring ring-neutral-200 px-4 py-2 text-sm font-medium transition-colors duration-200 ${selectedSize === size ? "bg-teal-600 text-white border-teal-700" : "bg-white text-neutral-700 hover:bg-neutral-50"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Add to Cart Section */}
            <div className="mt-6 flex w-full items-stretch gap-3 pt-4">
                <QuantitySelector quantity={quantity} setQuantity={setQuantity} stock={stock} />
              <div className="flex-grow">
                <AddToCartButton
                    isCustomerSide={false} // Assuming this is correct for your use case
                    productId={productId}
                    quantity={quantity}
                    stock={stock}
                    availableColors={colors || []}
                    selectedColor={selectedColor}
                    availableSizes={sizes || []}
                    selectedSize={selectedSize}
                />
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* --- Section 3: Details & Guarantees (Common to all) --- */}
      <section aria-labelledby="details-heading" className="mt-10">
        <div className="divide-y divide-neutral-200 border-t border-neutral-200">
          <div aria-labelledby="details-heading" className="mt-10">
            <ProductInfoTabs description={description ?? ""} highlights={highlights || []} />
          </div>
          <div className="py-6">
            <h3 className="text-base font-medium text-neutral-900">Our Guarantee</h3>
            <div className="flex items-center mt-4 text-sm text-neutral-600">
              <ShieldCheck className="mr-3 h-5 w-5 flex-shrink-0 text-neutral-500" aria-hidden="true" />
              <span>Secure payments & 30-day money-back guarantee.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}