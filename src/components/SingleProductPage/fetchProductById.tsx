// /lib/data.ts

import { ProductType } from "@/types/product";

// Dummy data - replace this with your actual database/API call
const products: ProductType[] = [
  {
    id: 'prod-123-xyz',
    title: 'Classic Ceramic Mug',
    original_regular_price: 18.00,
    original_sale_price: 15.00,
    product_images: [
      '/images/mug-white-1.jpg', // Replace with your actual image paths
      '/images/mug-white-2.jpg',
      '/images/mug-white-3.jpg',
    ],
    category: 'Kitchenware',
    rating: 4.5,
    reviews: [
      {
        image: "/images/mug-white-3.jpg",
        createdAt: "15 Aug 2023",
        fullname: "Mostafa Jaafari",
        reviewtext: "hello world"
      }
    ],
    stock: 50,
    description: "Start your day with the simple elegance of our Classic Ceramic Mug. Made from high-quality, durable ceramic, this mug is designed for comfort and longevity. Its minimalist aesthetic fits perfectly into any kitchen decor, making it the ideal companion for your morning coffee or evening tea.",
    sales: 120,
    lastUpdated: "2023-08-20T12:00:00Z",
    createdAt: "2023-01-15T09:30:00Z",
    currency: "USD",
    sizes: [],
    colors: ["White"],
    owner: {
      name: "John Doe",
      image: "/images/user1.jpg",
      email: "john.doe@example.com"
    },
    productrevenu: 2700, // Add a dummy value for productrevenu
  },
  // ... add other products here
];

// Simulate a network delay and fetch a product by its ID
export async function fetchProductById(productId: string): Promise<ProductType | null> {
  console.log(`Fetching data for product: ${productId}`);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
  
  const product = products.find(p => p.id === productId);
  
  return product || null;
}