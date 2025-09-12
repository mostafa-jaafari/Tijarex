import { Timestamp } from "firebase-admin/firestore";

export type ReviewTypes = {
  email: string;
  image: string;
  createdAt: string;
  fullname: string | "unknown";
  reviewtext: string;
  rating: number;
}
export type ProductType = {
  category: string;
  colors: string[];
  createdAt: Timestamp;
  description: string;
  highlights: string[];
  id: string;
  lastUpdated: Timestamp;
  original_regular_price: number;
  original_sale_price: number;
  owner: {
    email: string;
    image: string;
    name: string;
  };
  permissions: {
    availableForAffiliates: boolean;
    sellInMarketplace: boolean;
  };
  product_images: string[];
  productrevenu: number;
  reviews: ReviewTypes[];
  sales: number;
  sizes: string[];
  stock: number;
  title: string;
};


export type AffiliateProductType = {
    AffiliateInfo?: {
      AffiliateCreatedAt: Timestamp;
      AffiliateDescription: string;
      AffiliateOwnerEmail: string;
      AffiliateRegularPrice: number;
      AffiliateSalePrice: number;
      AffiliateTitle: string;
      AffiliateUniqueId: string;
    };
    originalProductId: string;
};