"use client";

import { Search } from "lucide-react";
import { CustomDropdown } from "../UI/CustomDropdown";
import { toast } from "sonner";
import { ProductCardUI } from "../UI/ProductCardUI";
import { type ProductType } from "@/types/product";
import { useUserInfos } from "@/context/UserInfosContext";


export default function ProductsPage() {
    const product: ProductType = {
                        id: "1",
                        title: "Sample Product",
                        description: "This is a sample product description.",
                        original_regular_price: 39.99,
                        original_sale_price: 29.99,
                        currency: "USD",
                        stock: 100,
                        sales: 600,
                        product_images: [
                            "",
                            "",
                            ""
                        ],
                        category: ["Sample Category"],
                        rating: 4.5,
                        lastUpdated: "15-08-2023",
                        createdAt: "01-08-2023",
                        sizes: ["S", "M", "L"],
                        colors: ["Red", "Blue", "Green"],
                        reviews: [],
                        productrevenu: 1500,
    };
    const { userInfos } = useUserInfos();
    return (
        <section>
            {/* --- Top Header Products Page --- */}
            <div
                className="w-full flex justify-center"
            >
                <div
                    className="group bg-white flex gap-3 items-center px-3 grow max-w-[600px] min-w-[400px] border-b
                        border-neutral-400/80 ring ring-neutral-200 
                        rounded-lg shadow-sm"
                >
                    <Search 
                        size={20}
                        className="text-neutral-400"
                    />
                    <input 
                        type="text" 
                        name="" 
                        id=""
                        placeholder="Search products..."
                        className="grow rounded-lg outline-none py-2"
                    />
                </div>
            </div>
            {/* --- Top Filter DropDowns --- */}
            <div
                className="flex items-center justify-between mt-3"
            >
                <div
                    className="w-full flex gap-3"
                >
                    <CustomDropdown
                        options={["All Categories", "Category 1", "Category 2", "Category 3"]}
                        selectedValue="All Categories"
                        onSelect={(value) => toast.info(value)}
                    />
                    <CustomDropdown
                        options={["All Categories", "Category 1", "Category 2", "Category 3"]}
                        selectedValue="All Categories"
                        onSelect={(value) => toast.info(value)}
                    />
                    <CustomDropdown
                        options={["All Categories", "Category 1", "Category 2", "Category 3"]}
                        selectedValue="All Categories"
                        onSelect={(value) => toast.info(value)}
                    />
                    <CustomDropdown
                        options={["All Categories", "Category 1", "Category 2", "Category 3"]}
                        selectedValue="All Categories"
                        onSelect={(value) => toast.info(value)}
                    />
                </div>
                <div
                    className="flex items-center gap-3"
                >
                    <p
                        className="text-nowrap text-sm text-neutral-500"
                    >
                        Sort by : 
                    </p>
                    <CustomDropdown
                        options={["All Categories", "Category 1", "Category 2", "Category 3"]}
                        selectedValue="All Categories"
                        onSelect={(value) => toast.info(value)}
                    />
                </div>
            </div>
            {/* --- Divider --- */}
            <hr className="w-full border-neutral-200 mt-2 mb-3"/>
            <div
                className="w-full grid grid-cols-4 bg-white border-b border-neutral-400 
                    ring ring-neutral-200 rounded-xl p-3"
            >
                <ProductCardUI
                    isAffiliate={userInfos?.UserRole === "affiliate"}
                    isFavorite={true}
                    onAddToStore={() => toast.success("Added to store")}
                    onQuickView={() => toast.success("Quick view opened")}
                    onToggleFavorite={() => toast.success("Toggled favorite")}
                    product={product}
                />
            </div>
        </section>
    )
}