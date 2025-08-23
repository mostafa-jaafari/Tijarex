import { ProductType } from "@/types/product";

export const getStockBadge = (status: ProductType['status']) => {
    switch (status) {
        case "In Stock":
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        case "Low Stock":
            return "bg-amber-50 text-amber-700 border-amber-200";
        case "Limited Edition":
            return "bg-purple-50 text-purple-700 border-purple-200";
        case "Pre-Order":
            return "bg-blue-50 text-blue-700 border-blue-200";
        case "Out of Stock":
            return "bg-red-50 text-red-700 border-red-200";
        default:
            return "bg-gray-50 text-gray-700 border-gray-200";
    }
};