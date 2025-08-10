export const FakeProducts: {
    id: number;
    image: string;
    title: string;
    description: string;
    price: number;
    rating: number;
    category: string;
    originalPrice: number;
}[] = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg",
    title: "Wireless Headphones",
    description: "High-quality sound with noise cancellation.",
    price: 150,
    originalPrice: 250,
    rating: 4.5,
    category: "electronics",
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg",
    title: "Smartphone 12 Pro",
    description: "Latest model with advanced camera features.",
    price: 999,
    originalPrice: 250,
    rating: 4.5,
    category: "electronics",
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/6311396/pexels-photo-6311396.jpeg",
    title: "Men's Leather Jacket",
    description: "Stylish and durable leather jacket for men.",
    price: 220,
    originalPrice: 250,
    rating: 4.5,
    category: "fashion",
  },
  {
    id: 4,
    image: "https://images.pexels.com/photos/6311581/pexels-photo-6311581.jpeg",
    title: "Women's Handbag",
    description: "Elegant handbag suitable for all occasions.",
    price: 85,
    originalPrice: 250,
    rating: 4.5,
    category: "fashion",
  },
  {
    id: 5,
    image: "https://images.pexels.com/photos/3735206/pexels-photo-3735206.jpeg",
    title: "4K Smart TV",
    description: "Ultra HD 4K TV with built-in streaming apps.",
    price: 600,
    originalPrice: 250,
    rating: 4.5,
    category: "electronics",
  },
  {
    id: 6,
    image: "https://images.pexels.com/photos/1457848/pexels-photo-1457848.jpeg",
    title: "Washing Machine",
    description: "High-efficiency front load washing machine.",
    price: 480,
    originalPrice: 250,
    rating: 4.5,
    category: "home-appliances",
  },
  {
    id: 7,
    image: "https://images.pexels.com/photos/276671/pexels-photo-276671.jpeg",
    title: "Microwave Oven",
    description: "900W microwave with grill and convection.",
    price: 130,
    originalPrice: 250,
    rating: 4.5,
    category: "home-appliances",
  },
  {
    id: 8,
    image: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg",
    title: "Blender Set",
    description: "Multi-functional blender with glass jar.",
    price: 60,
    originalPrice: 250,
    rating: 4.5,
    category: "home-appliances",
  },
  {
    id: 9,
    image: "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
    title: "Casual Sneakers",
    description: "Comfortable and lightweight sneakers.",
    price: 75,
    originalPrice: 250,
    rating: 4.5,
    category: "fashion",
  },
  {
    id: 10,
    image: "https://images.pexels.com/photos/7679468/pexels-photo-7679468.jpeg",
    title: "Laptop Pro X",
    description: "Powerful laptop for work and play.",
    price: 1350,
    originalPrice: 250,
    rating: 4.5,
    category: "electronics",
  },
  {
    id: 11,
    image: "https://images.pexels.com/photos/6311601/pexels-photo-6311601.jpeg",
    title: "Men's Classic Watch",
    description: "Water-resistant watch with leather strap.",
    price: 110,
    originalPrice: 250,
    rating: 4.5,
    category: "fashion",
  },
  {
    id: 12,
    image: "https://images.pexels.com/photos/1034651/pexels-photo-1034651.jpeg",
    title: "Coffee Maker",
    description: "Brew fresh coffee with this compact machine.",
    price: 90,
    originalPrice: 250,
    rating: 4.5,
    category: "home-appliances",
  },
];

export const Fake_Products = [
  {
    id: 1,
    name: "Vintage Leather Backpack",
    price: 79.99,
    uploadDate: "2025-08-05",
    image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad",
    category: "Bags",
    stock: 12,
    description: "Handmade leather backpack with premium stitching.",
    owner: {
      name: "Ahmed El Mansouri",
      image: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1"
    }
  },
  {
    id: 2,
    name: "Minimalist Wooden Watch",
    price: 45.5,
    uploadDate: "2025-08-07",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    category: "Accessories",
    stock: 30,
    description: "Eco-friendly wooden watch with minimalist design.",
    owner: {
      name: "Sara Benali",
      image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39"
    }
  },
  {
    id: 3,
    name: "Handcrafted Ceramic Mug",
    price: 15,
    uploadDate: "2025-08-06",
    image: "https://images.unsplash.com/photo-1574007659841-07aa5e56d5a4",
    category: "Home Decor",
    stock: 50,
    description: "Unique ceramic mug perfect for coffee lovers.",
    owner: {
      name: "Omar Lahlou",
      image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6"
    }
  },
  {
    id: 4,
    name: "Organic Cotton Hoodie",
    price: 59.99,
    uploadDate: "2025-08-08",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
    category: "Clothing",
    stock: 25,
    description: "Comfortable organic cotton hoodie available in multiple colors.",
    owner: {
      name: "Leila Meskini",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2"
    }
  },
  {
    id: 5,
    name: "Bluetooth Wireless Earbuds",
    price: 39.99,
    uploadDate: "2025-08-02",
    image: "https://images.unsplash.com/photo-1583225272829-1d55a3f3a933",
    category: "Electronics",
    stock: 40,
    description: "High-quality sound and noise cancellation.",
    owner: {
      name: "Youssef Haddad",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36"
    }
  },
  {
    id: 6,
    name: "Luxury Scented Candle",
    price: 25,
    uploadDate: "2025-08-04",
    image: "https://images.unsplash.com/photo-1519922639192-e73293ca430e",
    category: "Home Fragrance",
    stock: 15,
    description: "Relaxing scented candle with lavender aroma.",
    owner: {
      name: "Fatima Zahra",
      image: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c"
    }
  },
  {
    id: 7,
    name: "Travel Duffel Bag",
    price: 89.99,
    uploadDate: "2025-08-01",
    image: "https://images.unsplash.com/photo-1590784076446-0f4b7b68d1e5",
    category: "Travel",
    stock: 10,
    description: "Spacious and durable duffel bag for long trips.",
    owner: {
      name: "Hicham Ait Taleb",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
    }
  },
  {
    id: 8,
    name: "Custom Graphic T-Shirt",
    price: 22,
    uploadDate: "2025-08-03",
    image: "https://images.unsplash.com/photo-1520975922071-c3c5ab33a2a0",
    category: "Clothing",
    stock: 35,
    description: "High-quality cotton T-shirt with custom print.",
    owner: {
      name: "Khadija Idrissi",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
    }
  }
];