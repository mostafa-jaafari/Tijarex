export type ReviewTypes = {
  email: string;
  image: string;
  createdAt: string;
  fullname: string | "unknown";
  reviewtext: string;
  rating: number;
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
  permissions: {
    availableForAffiliates?: boolean;
    sellInMarketplace?: boolean;
  };
  owner?: {
    name: string;
    image: string;
    email: string;
  };
  productrevenu: number;
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