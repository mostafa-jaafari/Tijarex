"use client";

import { Check, Star, ShieldCheck } from "lucide-react";
import { AffiliateProductType, ProductType } from "@/types/product";
import { AddToCartButton } from "@/components/UI/Add-To-Cart/AddToCartButton";
import { QuantitySelector } from "@/components/UI/Add-To-Cart/QuantitySelector";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from 'framer-motion';

// You would pass these props into the component
type ProductInfoTabsProps = {
  description: string;
  highlights: string[];
};

function ProductInfoTabs({ description, highlights }: ProductInfoTabsProps) {
  // We structure our tabs as an array of objects for better scalability
  const tabs = [
    {
      id: 'description',
      label: 'Description',
      // We define the content as JSX right here for cleaner mapping
      content: (
        <div>
          <h3 className="text-lg font-semibold text-neutral-800">Description</h3>
          <p className="my-4 text-sm text-neutral-600 leading-relaxed prose">
            {description}
          </p>
        </div>
      ),
    },
    {
      id: 'highlights',
      label: 'Highlights',
      content: (
        <div>
          <h3 className="text-lg font-semibold text-neutral-800">Product Highlights</h3>
          <ul className="my-4 space-y-3">
            {highlights.map((highlight) => (
              <li key={highlight} className="flex items-center text-sm text-neutral-600">
                <Check
                  className="mr-3 h-5 w-5 flex-shrink-0 text-teal-500"
                  aria-hidden="true"
                />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
  ];

  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  // Animation variants for the content pane
  const contentVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="w-full">
      {/* Tab Buttons */}
      <nav>
        <div role="tablist" aria-label="Product Information" className="flex border-b border-neutral-200">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              role="tab"
              aria-selected={selectedTab.id === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              className={`relative w-full py-3 px-4 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
                selectedTab.id === tab.id
                  ? 'text-teal-600'
                  : 'text-neutral-500 hover:text-neutral-800 cursor-pointer'
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab.label}
              {/* The animated underline */}
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

      {/* Tab Content */}
      <main className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab.id}
            id={`tabpanel-${selectedTab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${selectedTab.id}`}
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {selectedTab.content}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

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
  const Reviews = isAffiliateProduct(product) ? null : product.reviews;

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

  const averageRating = useMemo(() => {
    if(!Reviews) return;
    if (Reviews.length === 0) return 0;
    const sum = Reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / Reviews.length;
  }, [Reviews]);
  
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
        <h1 
            className="text-3xl font-extrabold tracking-tight 
                text-neutral-900">
          {title}
        </h1>
        <div className="flex items-center justify-between">
          <p
            className="text-2xl font-bold tracking-tight 
              text-neutral-900">
            {isOnSale && (
              <span className="mr-3 text-lg font-medium text-neutral-400 line-through">
                {regularPrice.toFixed(2)} dh
              </span>
            )}
            {salePrice.toFixed(2)} dh
          </p>
          {/* Reviews only show for standard products */}
          {!isAffiliateProduct(product) && (
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 flex-shrink-0 ${(averageRating) && averageRating > i ? "text-yellow-400 fill-yellow-400" : "text-neutral-300"}`} aria-hidden="true" />
                ))}
              </div>
              <a 
                href="#reviews" 
                className="text-sm text-neutral-500 
                  hover:text-neutral-400"
              >
                ({Reviews?.length || 0} reviews)
              </a>
            </div>
          )}
        </div>
      </div>

      <hr className="my-6 border-neutral-200" />

      {/* --- Section 2: Description, Options, and Actions --- */}
      <div className="space-y-6">
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
                <h3 className="text-sm font-semibold text-neutral-800">
                  Color : <span className="font-normal text-neutral-600">{selectedColor}</span>
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
                                "hover:border-neutral-400 cursor-pointer"}
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
                <h3 className="text-sm font-semibold text-neutral-800">
                    Size : <span className="font-normal text-neutral-600">{selectedSize}</span>
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
                                "bg-white text-neutral-700 cursor-pointer border-neutral-300 hover:bg-neutral-50"}
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
        <div className="divide-y divide-neutral-200 border-t border-neutral-200">
          <div 
            aria-labelledby="details-heading" 
            className="mt-10"
          >
            <ProductInfoTabs 
              description={description} 
              highlights={highlights} 
            />
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