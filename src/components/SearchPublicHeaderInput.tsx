"use client";

import { useGlobalProducts } from "@/context/GlobalProductsContext";
import { ProductType } from "@/types/product";
import { ChevronRight, Loader2, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";

// A custom hook for debouncing input values
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// --- Reusable sub-component for displaying a product in the suggestions list ---
const ProductItem = ({
  item,
  onClick,
}: {
  item: ProductType;
  onClick: () => void;
}) => (
  <Link
    key={item.id}
    href={`/c/shop/product?pid=${item.id}`}
    onClick={onClick}
    className="relative group w-full flex items-center gap-3 py-2 px-3 text-sm hover:bg-neutral-100 rounded-lg transition-colors duration-200"
  >
    <div className="relative w-12 h-12 rounded-lg overflow-hidden ring-1 ring-gray-200 group-hover:ring-2 group-hover:ring-teal-500 transition-all">
      <Image
        src={item.product_images[0] || "/placeholder.png"}
        alt={item.title}
        fill
        sizes="50px"
        className="object-cover bg-gray-100"
      />
    </div>
    <div className="flex flex-col">
      <span className="text-neutral-900 group-hover:text-teal-600 transition-colors">
        {item.title}
      </span>
      <span className="flex items-end gap-1.5">
        <b className="text-teal-600 text-base">
          {item.original_sale_price.toFixed(2)} Dh
        </b>
        {item.original_regular_price > item.original_sale_price && (
          <del className="text-neutral-400 text-xs">
            {item.original_regular_price.toFixed(2)} Dh
          </del>
        )}
      </span>
    </div>
    <span className="absolute right-3 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
      <ChevronRight size={18} />
    </span>
  </Link>
);


export function SearchPublicHeaderInput() {
  const [searchInput, setSearchInput] = useState("");
  const [showSuggestionsMenu, setShowSuggestionsMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const { globalProductsData, isLoadingMore: areProductsLoading } = useGlobalProducts();

  const debouncedSearchInput = useDebounce(searchInput, 300);

  // --- ⭐️ Memoize the trending products list for performance ---
  const trendingProducts = useMemo(() => {
    if (!globalProductsData || globalProductsData.length === 0) {
      return [];
    }
    // Create a "trend score" to find the best products based on ratings and reviews
    return [...globalProductsData]
      .sort((a, b) => {
        const scoreA = (a.rating || 0) * 5 + (a.reviews?.length || 0);
        const scoreB = (b.rating || 0) * 5 + (b.reviews?.length || 0);
        return scoreB - scoreA; // Sort descending by score
      })
      .slice(0, 6); // Take the top 6 products
  }, [globalProductsData]);

  const searchResult = useMemo(() => {
    if (!debouncedSearchInput) return [];
    const lowercasedQuery = debouncedSearchInput.toLowerCase();
    return globalProductsData.filter(
      (product) =>
        product.title.toLowerCase().includes(lowercasedQuery) ||
        product.category.toLowerCase().includes(lowercasedQuery) ||
        product.owner?.name.toLowerCase().includes(lowercasedQuery)
    );
  }, [debouncedSearchInput, globalProductsData]);

  useEffect(() => {
    setIsLoading(debouncedSearchInput !== searchInput);
  }, [searchInput, debouncedSearchInput]);

  useEffect(() => {
    const handleHideMenu = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowSuggestionsMenu(false);
      }
    };
    document.addEventListener("mousedown", handleHideMenu);
    return () => document.removeEventListener("mousedown", handleHideMenu);
  }, []);

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prevCount) => prevCount + 10);
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col gap-2 p-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-full h-12 animate-pulse bg-gray-200 rounded-md" />
          ))}
        </div>
      );
    }

    if (debouncedSearchInput && searchResult.length > 0) {
      return (
        <>
          <div className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-500">Search Results</div>
          {searchResult.slice(0, visibleCount).map((item) => (
            <ProductItem key={item.id} item={item} onClick={() => setShowSuggestionsMenu(false)} />
          ))}
          {searchResult.length > visibleCount && (
            <button
              onClick={handleLoadMore}
              className="w-full text-center py-2 text-sm font-semibold text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
            >
              Load More
            </button>
          )}
        </>
      );
    }

    if (debouncedSearchInput && searchResult.length === 0) {
      return (
        <div className="w-full flex justify-center py-4 text-gray-500 text-sm">
          No products found!
        </div>
      );
    }

    // --- ⭐️ Show trending products when input is empty ---
    if (!debouncedSearchInput && trendingProducts.length > 0) {
      return (
        <>
          <div className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-500">Trending Products</div>
          {trendingProducts.map((item) => (
            <ProductItem key={item.id} item={item} onClick={() => setShowSuggestionsMenu(false)} />
          ))}
        </>
      );
    }

    // Fallback if no trending products are available
    return (
      <div className="p-2">
        <p className="text-sm text-gray-500 text-center py-3">
          Search for products by title, category, or brand.
        </p>
      </div>
    );
  };

  return (
    <section ref={menuRef} className="relative w-full max-w-[600px]">
      <div
        className={`border bg-white rounded-lg py-1 pr-1 pl-3 flex items-center transition-all duration-300 ${
          showSuggestionsMenu
            ? "ring-2 ring-teal-500 border-transparent"
            : "border-neutral-300 ring-neutral-200 hover:border-neutral-400"
        }`}
      >
        {isLoading ? (
            <Loader2 size={16} className="animate-spin mr-2 text-teal-600" />
          ) : (
            <Search size={18} className="text-neutral-500 mr-2" />
          )}
        <input
          type="text"
          onFocus={() => setShowSuggestionsMenu(true)}
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
          placeholder="What are you looking for?"
          className="py-2 w-full h-full text-sm outline-none border-none rounded bg-transparent"
          disabled={areProductsLoading}
        />
      </div>

      <div
        className={`absolute left-0 top-full w-full mt-2 origin-top transition-all duration-200 ease-out ${
          showSuggestionsMenu
            ? "transform scale-y-100 opacity-100"
            : "transform scale-y-95 opacity-0 pointer-events-none"
        }`}
      >
        <div className="w-full max-h-[70vh] bg-white rounded-xl border p-2 border-gray-200 flex flex-col overflow-auto shadow-lg">
          {renderContent()}
        </div>
      </div>
    </section>
  );
}