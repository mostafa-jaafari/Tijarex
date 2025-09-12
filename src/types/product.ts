import { type Timestamp } from "firebase-admin/firestore";

// يمثل مستندًا في مجموعة `reviews` الفرعية داخل المنتج
export type ReviewType = {
  id: string; // Document ID of the review
  userId: string; // Reference to the user who wrote it
  userImage: string;
  userFullname: string;
  reviewText: string;
  rating: number;
  createdAt: Timestamp; // Use Firestore Timestamp for proper sorting
};

// يمثل المنتج الأصلي في مجموعة `products`
// هذا هو المصدر الوحيد للحقيقة بالنسبة لتفاصيل المنتج والمخزون
export type ProductType = {
  id: string; // Document ID
  sellerId: string; // Reference to the user (seller)
  
  // Core Product Details
  title: string;
  description: string;
  productImages: string[];
  category: string;
  currency: string;
  originalPrice: number; // The single base price set by the seller
  compareAtPrice?: number; // Optional "was" price for sales
  stockQuantity: number; // The master stock count
  
  // Variants
  sizes: string[];
  colors: string[];

  // Visibility and Permissions
  listingType: "marketplace" | "affiliateOnly"; // Determines where the product appears initially

  // Seller Information (Denormalized for easy access)
  sellerInfo: {
    name: string;
    image: string;
    email: string;
  };

  // Tracking & Timestamps
  totalSales: number; // Incremented for every sale (direct or affiliate)
  totalRevenue: number; // Total revenue generated for the seller
  createdAt: Timestamp;
  lastUpdated: Timestamp;
  
  // Reviews and Ratings - Storing the average here is good practice
  averageRating: number;
  reviewCount: number;
};

// يمثل نسخة المسوق بالعمولة في مجموعة `affiliateProducts`
// هذا المستند خفيف جدًا ويشير فقط إلى المنتج الأصلي
export type AffiliateProductType = {
  id: string; // Document ID of this affiliate version
  
  // --- Links to Original Product and Owners ---
  originalProductId: string; // CRITICAL: Link back to the product in `products` collection
  sellerId: string; // Denormalized seller ID
  affiliateId: string; // The user ID of the affiliate
  
  // --- Affiliate's Custom Overrides ---
  affiliateTitle: string; // Affiliate can customize the title
  affiliateDescription: string; // And the description
  affiliatePrice: number; // The price the affiliate sets (must be > originalPrice)

  // --- Commission & Tracking ---
  commission: number; // Calculated: (affiliatePrice - originalPrice)
  totalSales: number; // How many times this affiliate sold this product
  totalCommissionEarned: number; // Total commission for this specific product link
  
  // --- Timestamps ---
  createdAt: Timestamp; // When the affiliate claimed this product
};