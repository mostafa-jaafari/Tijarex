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

// A custom hook for debouncing input values to prevent excessive re-renders
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup the timeout if the value changes before the delay has passed
    return () => {
      clearTimeout(handler);
    }
  }, [value, delay]);

  return debouncedValue;
};

export function SearchPublicHeaderInput() {
  const [searchInput, setSearchInput] = useState("");
  const [showSuggestionsMenu, setShowSuggestionsMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10); // Initial number of items to show

  const menuRef = useRef<HTMLDivElement | null>(null);

  // Fetching global product data and loading state from context
  const { globalProductsData, isLoadingMore: areProductsLoading } = useGlobalProducts();

  // Debounce search input to optimize performance
  const debouncedSearchInput = useDebounce(searchInput, 300);

  // Memoize search results to avoid re-calculating on every render
  const searchResult = useMemo(() => {
    if (!debouncedSearchInput) {
      return [];
    }
    const lowercasedQuery = debouncedSearchInput.toLowerCase();
    return globalProductsData.filter(
      (product: ProductType) =>
        product.title.toLowerCase().includes(lowercasedQuery) ||
        product.category.toLowerCase().includes(lowercasedQuery) ||
        product.owner?.name.toLowerCase().includes(lowercasedQuery)
    );
  }, [debouncedSearchInput, globalProductsData]);

  // Manage loading state based on input changes
  useEffect(() => {
    if (debouncedSearchInput !== searchInput) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [searchInput, debouncedSearchInput]);

  // Effect to close the suggestions menu when clicking outside
  useEffect(() => {
    const handleHideMenu = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowSuggestionsMenu(false);
      }
    };
    document.addEventListener("mousedown", handleHideMenu);
    return () => document.removeEventListener("mousedown", handleHideMenu);
  }, []);

  // Callback to handle loading more results
  const handleLoadMore = useCallback(() => {
    setVisibleCount((prevCount) => prevCount + 10);
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col gap-2 p-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-full h-10 animate-pulse flex bg-gray-200 rounded-md"
            />
          ))}
        </div>
      );
    }

    if (searchResult.length > 0) {
      return (
        <>
          {searchResult.slice(0, visibleCount).map((item) => (
            <Link
              key={item.id} // Assuming the product object has a unique `_id`
              href={`/c/shop/product?pid=${item.id}`}
              onClick={() => setShowSuggestionsMenu(false)}
              className="relative group w-full flex items-center gap-3 py-2 
                px-3 text-sm hover:bg-neutral-100 shadoow-sm rounded-lg 
                transition-colors duration-200"
            >
              <div
                className="relative w-12 h-12 rounded-lg overflow-hidden
                  group-hover:ring-2 group-hover:border-2 ring-teal-600 
                  border-neutral-200"
              >
                <Image
                  src={item.product_images[0] || "/placeholder.png"} // Use a placeholder if no image
                  alt={item.title}
                  fill
                  className="object-cover rounded-md bg-gray-100"
                />
              </div>
              <div
                className="flex flex-col "
              >
                <span 
                  className="font-medium text-neutral-800"
                >
                  {item.title}
                </span>
                <span
                  className="flex items-end gap-1"
                >
                  <b
                    className="text-teal-600"
                  >
                    {item.original_sale_price} Dh
                  </b>
                  <del
                    className="text-neutral-500 text-xs"
                  >
                    {item.original_regular_price}Dh
                  </del>
                </span>
              </div>
              <span
                  className="absolute right-3 hidden group-hover:flex text-teal-600"
                >
                  <ChevronRight size={18}/>
                </span>
            </Link>
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

    // Initial state when the input is empty
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
        <Search size={18} className="text-neutral-400 mr-2" />
        <input
          type="text"
          onFocus={() => setShowSuggestionsMenu(true)}
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
          placeholder="What are you looking for?"
          className="w-full h-full text-sm outline-none border-none rounded bg-transparent"
          disabled={areProductsLoading}
        />
        <button
          className="bg-teal-600 text-white hover:bg-teal-700 cursor-pointer p-2 rounded-md transition-colors"
          aria-label="Search"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Search size={16} />
          )}
        </button>
      </div>

      <div
        className={`absolute left-0 top-full w-full mt-2 origin-top transition-all duration-200 ease-out ${
          showSuggestionsMenu
            ? "transform scale-y-100 opacity-100"
            : "transform scale-y-95 opacity-0 pointer-events-none"
        }`}
      >
        <div className="w-full max-h-80 bg-white rounded-xl border p-2 border-gray-200 flex flex-col overflow-auto shadow-lg">
          {renderContent()}
        </div>
      </div>
    </section>
  );
}