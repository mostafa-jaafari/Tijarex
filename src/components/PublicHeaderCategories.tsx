"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const CATEGORIES_WITH_SUBCATEGORIES = [
  {
    name: "Fashion",
    subcategories: ["Clothes", "Men", "Women", "Kids"],
  },
  {
    name: "Books",
    href: "/c/shop?cat=books",
  },
  {
    name: "Art",
    href: "/c/shop?cat=art",
  },
];

export function PublicHeaderCategories() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex justify-center items-center px-6">
        {CATEGORIES_WITH_SUBCATEGORIES.map((category) => (
          <div
            key={category.name}
            className="relative group"
            onMouseEnter={() => category.subcategories && setOpenDropdown(category.name)}
            onMouseLeave={() => category.subcategories && setOpenDropdown(null)}
          >
            <Link
              href={category.href || "#"}
              prefetch
              className="flex items-center px-4 py-3 text-sm font-medium text-neutral-700 hover:text-teal-600 transition-colors duration-300"
            >
              {category.name}
              {category.subcategories && (
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform duration-300 ${
                    openDropdown === category.name ? "rotate-180" : ""
                  }`}
                />
              )}
            </Link>
            {category.subcategories && openDropdown === category.name && (
              <div
                className="absolute left-0 mt-0 w-48 bg-white rounded-md shadow-lg z-10"
              >
                <div className="py-1">
                  {category.subcategories.map((subcategory) => (
                    <Link
                      prefetch
                      key={subcategory}
                      href={`/c/shop?cat=${subcategory.toLowerCase().replace(" ", "")}`}
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-teal-600"
                    >
                      {subcategory}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}