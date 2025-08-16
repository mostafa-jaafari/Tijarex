"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";


export function ShopFilter() {
  const [category, setCategory] = useState<string>("all");
  const [price, setPrice] = useState<[number, number]>([0, 100]);

  const Params = useSearchParams();
  const SearchCat = Params.get("cat") || "All";
  return (
    <aside 
        className="sticky top-16 h-[calc(99vh-4rem)] 
            w-64 shrink-0 bg-white p-4 shadow-md 
            rounded-xl overflow-y-auto text-sm">
      {/* 🏷️ عنوان */}
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      {/* 📂 الفئات */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Category</h3>
        <ul className="space-y-2">
          {["all", "books", "electronics", "fashion", "home"].map((cat) => (
            <li key={cat}>
              <Link
                href={`/shop?cat=${cat}`}
                onClick={() => setCategory(cat)}
                className={`w-full flex text-left px-2 py-1 rounded-md transition ${
                  SearchCat.toLowerCase() === cat.toLowerCase()
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 💲 السعر */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Price</h3>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={price[0]}
            onChange={(e) =>
              setPrice([Number(e.target.value), price[1]])
            }
            className="w-16 border rounded px-1"
          />
          <span>-</span>
          <input
            type="number"
            value={price[1]}
            onChange={(e) =>
              setPrice([price[0], Number(e.target.value)])
            }
            className="w-16 border rounded px-1"
          />
        </div>
      </div>

      {/* ↕️ الترتيب */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Sort By</h3>
        <select className="w-full border rounded px-2 py-1">
          <option value="popularity">Popularity</option>
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {/* 🔘 زر تطبيق */}
      <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition">
        Apply Filters
      </button>
    </aside>
  );
}
