"use client";
import { categories } from "@/app/[locale]/shop/ressources/Categories";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";


export function ShopFilter() {
  const [price, setPrice] = useState<[number, number]>([0, 100]);

  const Params = useSearchParams();
  const SearchCat = Params.get("cat") || "All";
  const [showCategoriesLength, setShowCategoriesLength] = useState(5);
  return (
    <aside 
        className="sticky top-16 h-[calc(99vh-4rem)] 
            w-64 shrink-0 bg-gray-200 p-4 shadow-sm 
            rounded-xl overflow-y-auto text-sm">
      {/* ---  Big Title --- */}
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      {/* --- Categories --- */}
      <div className="mb-6">
        <span
            className="flex items-center justify-between"
        >
            <h3 className="font-bold text-gray-700 mb-2">Category</h3>
            {showCategoriesLength > 5 && (
                <p
                    onClick={() => setShowCategoriesLength(5)}
                    className="text-gray-400 cursor-pointer text-xs
                        hover:bg-gray-100 p-1 rounded"
                    >
                    Show Less
                </p>
            )}
        </span>
        <ul className="space-y-2">
          {categories.slice(0, showCategoriesLength).map((cat) => (
            <li key={cat}>
              <Link
                href={`/shop?cat=${cat.toLowerCase().trim().replace(" ","")}`}
                className={`w-full flex text-left px-2 py-1 rounded-md transition ${
                  SearchCat.toLowerCase() === cat.toLowerCase()
                    ? "bg-white shadow-sm text-black font-semibold py-1"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Link>
            </li>
          ))}
            {showCategoriesLength !== categories.length && (
                <button
                    onClick={() => setShowCategoriesLength(prev => prev + 5)}
                    className="w-full flex text-gray-500 items-center 
                        cursor-pointer gap-1 justify-center text-xs
                        hover:bg-gray-100 py-1 rounded"
                    >
                    Show more <ChevronDown size={16} />
                </button>
            )}
        </ul>
      </div>

      {/* --- Price --- */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-700 mb-2">Price</h3>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={price[0]}
            onChange={(e) =>
              setPrice([Number(e.target.value), price[1]])
            }
            className="w-16 ring ring-gray-300 text-gray-400 
                focus:ring-gray-600 outline-none 
                focus:text-gray-600 rounded px-1"
          />
          <span>-</span>
          <input
            type="number"
            value={price[1]}
            onChange={(e) =>
              setPrice([price[0], Number(e.target.value)])
            }
            className="w-16 ring ring-gray-300 text-gray-400 
                focus:ring-gray-600 outline-none 
                focus:text-gray-600 rounded px-1"
          />
        </div>
      </div>

      {/* --- Sorts --- */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-700 mb-2">Sort By</h3>
        <select className="w-full border rounded px-2 py-1">
          <option value="popularity">Popularity</option>
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {/* --- Apply Button --- */}
      <button 
        className="w-full primary-button-b py-2">
        Apply Filters
      </button>
    </aside>
  );
}
