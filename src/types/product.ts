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

export interface ProductCardProps{
    PRODUCTIMAGES: string[];
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

// You likely already have this in your types file
export type ProductOwner = {
    name: string;
    image: string;
    email: string;
};


export type AffiliateProductType = {
    id: string;

    // --- Data Copied from the Original Product ---
    originalProductId: string;
    owner: { name: string; image: string; email: string; } | null;
    product_images: string[];
    category: string;
    sizes: string[];
    colors: string[];
    stock: number; // ADDED
    sales: number; // ADDED
    currency: string;

    // --- Data Specific to the Affiliate's Version ---
    AffiliateOwnerEmail: string;
    AffiliateTitle: string;
    AffiliateDescription: string;
    AffiliateSalePrice: number;
    AffiliateRegularPrice: number;
    AffiliateCreatedAt: string;
};