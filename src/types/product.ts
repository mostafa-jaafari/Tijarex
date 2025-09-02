export type ReviewTypes = {
  image: string;
  createdAt: string;
  fullname: string | "unknown";
  reviewtext: string;
}
export type ProductType = {
  id: string;
  category: string;
  product_images: string[];
  original_sale_price: number;
  original_regular_price: number;
  stock: number;
  title: string;
  sales: number;
  lastUpdated: string;
  createdAt: string;
  rating: number;
  currency: string;
  reviews: ReviewTypes[];
  description: string;
  sizes: string[];
  colors: string[];
  owner?: {
    name: string;
    image: string;
    email: string;
  };
  productrevenu: number;
};

export type AffiliateProduct = ProductType & {
    affiliateId: string;
    commissionRate: number;
    isActive: boolean;
    AffiliateOriginalProductId: string;
    AffiliateOwnerEmail: string;
    AffiliateCommission: number;
    Affiliate_sale_price: number;
    AffiliateCreatedAt: string;
    Affiliatesales: 0;
};

export interface ProductCardProps{
    PRODUCTIMAGES: string;
    PRODUCTID: string | number;
    PRODUCTTITLE: string;
    PRODUCTSALEPRICE: number;
    PRODUCTREGULARPRICE: number;
    PRODUCTCATEGORY: string;
    OWNER?: {
        name: string;
        image: string;
    };
    STOCK: number;
}

export interface ProductType2 {
    id: string;
    sellerEmail: string;
    sellerFullName: string;
    name: string;
    isTrend?: boolean;
    product_images: string[];
    category: string;
    sale_price: number;
    regular_price: number;
    commission?: number;
    sales: number;
    revenue: number;
    status: "In Stock" | "Low Stock" | "Limited Edition" | "Pre-Order" | "Out of Stock";
    stock: number;
    lastUpdated: string; // ISO 8601 date string
}