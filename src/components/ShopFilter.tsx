"use client";
import { categories } from "@/app/[locale]/c/shop/ressources/Categories";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useState } from "react";


export function ShopFilter() {

  const Params = useSearchParams();
  const SearchCat = Params.get("cat") || "All";
  const [showCategoriesLength, setShowCategoriesLength] = useState(5);
  
  const [filtersInputs, setFiltersInputs] = useState({
    pricefrom: 0,
    priceto: 0,
    sort: "",
  });
  const [selectedSort, setSelectedSort] = useState("");
  const HandleChangeInputs = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFiltersInputs(prev => ({...prev, [name]: value}));
  }
  const router = useRouter();
  const HandleApplyFilters = () => {
    if (filtersInputs.pricefrom !== 0 || filtersInputs.priceto !== 0) {
      const PrevParams = new URLSearchParams(Params.toString());

      if (filtersInputs.pricefrom !== 0) {
        PrevParams.set("pf", String(filtersInputs.pricefrom));
      }

      if (filtersInputs.priceto !== 0) {
        PrevParams.set("pt", String(filtersInputs.priceto));
      }

      if (selectedSort !== "") {
        PrevParams.set("sortby", String(selectedSort));
      }

      router.push(`?${PrevParams.toString()}`);
    }
  };
  return (
    <aside 
        className="sticky top-16 h-[calc(99vh-4rem)] 
            w-64 shrink-0 bg-gray-200 p-4 shadow-sm 
            rounded-xl overflow-y-auto text-sm ring ring-gray-300">
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
                    className="text-gray-600 cursor-pointer text-xs
                        hover:text-black p-1 rounded"
                    >
                    Show Less
                </p>
            )}
        </span>
        <ul className="space-y-2">
          {categories.slice(0, showCategoriesLength).map((cat) => (
            <li key={cat}>
              <Link
                href={`/c/shop?cat=${cat.toLowerCase().trim().replace(" ","")}`}
                className={`w-full flex text-left px-3 py-1 rounded-md transition ${
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
                    className="w-full flex text-gray-600 items-center 
                        cursor-pointer gap-1 justify-center text-xs
                        hover:text-black py-1.5 rounded"
                    >
                    Show more <ChevronDown size={16} />
                </button>
            )}
        </ul>
      </div>

      {/* --- Price --- */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-900 mb-2">Price</h3>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={filtersInputs.pricefrom}
            onChange={(e) => HandleChangeInputs(e)}
            name="pricefrom"
            className="w-full py-1 text-center ring ring-gray-300 
                focus:ring-gray-600 outline-none 
                focus:text-gray-600 rounded px-1"
          />
          <span>-</span>
          <input
            type="number"
            value={filtersInputs.priceto}
            onChange={(e) => HandleChangeInputs(e)}
            name="priceto"
            className="w-full py-1 text-center ring ring-gray-300
                focus:ring-gray-600 outline-none 
                focus:text-gray-600 rounded px-1"
          />
        </div>
      </div>

      {/* --- Sorts --- */}
      {/* --- Apply Button --- */}
      <button 
        onClick={() => HandleApplyFilters()}
        className="w-full py-1.5
          rounded-lg shadow-sm text-gray-300 hover:text-gray-100">
        Apply Filters
      </button>
      {/* --- Clear Button --- */}
      {(Params.get("pf") ||
        Params.get("pt") ||
        Params.get("cat") ||
        Params.get("sortby")) && (
        <Link
          href="/c/shop"
          className="w-full flex justify-center py-1 mt-2 
          text-sm rounded-lg shadow-sm cursor-pointer
          bg-red-600 hover:bg-red-700 text-white"
        >
          Clear Filters
        </Link>
      )}
    </aside>
  );
}
