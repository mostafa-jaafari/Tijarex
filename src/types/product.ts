export type ProductType = {
  id: string;
  name: string;
  category: string[];
  product_images: string[];
  sale_price: number;
  regular_price: number;
  stock: number;
  status: string;
  title: string;
  sales: number;
  revenue: number;
  lastUpdated: string;
  rating: number;
  currency: string;
  reviewCount: number;
  description: string;
  sizes: {
    label: string;
    available: boolean;
  }[];
  colors: {
    name: string;
    color: string;
    selected: boolean;
  }[];
  owner?: {
    name: string;
    image: string;
  };
  isTrend: boolean;
};

// export interface ProductCardProps{
//     PRODUCTIMAGES: string[];
//     PRODUCTID: string | number;
//     PRODUCTTITLE: string;
//     PRODUCTSALEPRICE: number;
//     PRODUCTREGULARPRICE: number;
//     PRODUCTCATEGORIE: string[];
//     OWNER?: {
//         name: string;
//         image: string;
//     };
//     STOCK: number;
// }

// export interface ProductType2 {
//     id: string;
//     sellerEmail: string;
//     sellerFullName: string;
//     name: string;
//     isTrend?: boolean;
//     product_images: string[];
//     category: string[];
//     sale_price: number;
//     regular_price: number;
//     commission?: number;
//     sales: number;
//     revenue: number;
//     status: "In Stock" | "Low Stock" | "Limited Edition" | "Pre-Order" | "Out of Stock";
//     stock: number;
//     lastUpdated: string; // ISO 8601 date string
// }